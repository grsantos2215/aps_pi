const cam = document.getElementById("cam");
var contador = 0;

const startVideo = () => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
        if (Array.isArray(devices)) {
            devices.forEach((device) => {
                if (device.kind === "videoinput") {
                    console.log(device);
                    navigator.getUserMedia(
                        {
                            video: {
                                deviceId: device.deviceId,
                            },
                        },
                        (stream) => (cam.srcObject = stream),
                        (error) => console.error(error)
                    );
                }
            });
        }
    });
};

const loadLabels = () => {
    const labels = ["Gabriel", "Priscila"];
    return Promise.all(
        labels.map(async (label) => {
            const descriptions = [];
            for (let i = 1; i <= 3; i++) {
                const img = await faceapi.fetchImage(`assets/lib/face-api/labels/${label}/${i}.jpg`);
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                descriptions.push(detections.descriptor);
            }
            console.log(descriptions);
            return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
    );
};

Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri("/aps_pi/assets/lib/face-api/models"), faceapi.nets.faceLandmark68Net.loadFromUri("/aps_pi/assets/lib/face-api/models"), faceapi.nets.faceRecognitionNet.loadFromUri("/aps_pi/assets/lib/face-api/models"), faceapi.nets.faceExpressionNet.loadFromUri("/aps_pi/assets/lib/face-api/models"), faceapi.nets.ageGenderNet.loadFromUri("/aps_pi/assets/lib/face-api/models"), faceapi.nets.ssdMobilenetv1.loadFromUri("/aps_pi/assets/lib/face-api/models")]).then(startVideo);

cam.addEventListener("play", async () => {
    const canvas = faceapi.createCanvasFromMedia(cam);
    const canvasSize = {
        width: cam.width,
        height: cam.height,
    };
    const labels = await loadLabels();
    faceapi.matchDimensions(canvas, canvasSize);
    document.body.appendChild(canvas);
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(cam, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, canvasSize);
        const faceMatcher = new faceapi.FaceMatcher(labels, 0.6);
        const results = resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        results.forEach((result, index) => {
            const box = resizedDetections[index].detection.box;
            const { label, distance } = result;
            new faceapi.draw.DrawTextField([`${label} (${parseInt(distance * 100, 10)})`], box.bottomRight).draw(canvas);
            if (label != "unknown" && contador == 0) {
                $.ajax({
                    url: "assets/php/queries/query_login.php",
                    type: "POST",
                    data: `usuario=${label}&senha=${label}`,
                    dataType: "json",
                    success: function (data) {
                        console.log(data);
                        if (data.return.status == "success") {
                            window.location.href = data.return.url;
                        } else {
                            console.log(data.status);
                            Swal.fire({
                                title: "Ops... Ocorreu um erro",
                                text: "Infelizmente, não foi possível realizar o login. Por favor, tente novamente.",
                                icon: "warning",
                            }).then(function () {
                                location.reload();
                            });
                        }
                    },
                });
            }
        });
    }, 100);
});
