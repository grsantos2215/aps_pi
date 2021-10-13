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
                const img = await faceapi.fetchImage(`/assets/lib/face-api/labels/${label}/${i}.jpg`);
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                descriptions.push(detections.descriptor);
            }
            console.log(descriptions);
            return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
    );
};

Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri("/assets/lib/face-api/models"), faceapi.nets.faceLandmark68Net.loadFromUri("/assets/lib/face-api/models"), faceapi.nets.faceRecognitionNet.loadFromUri("/assets/lib/face-api/models"), faceapi.nets.faceExpressionNet.loadFromUri("/assets/lib/face-api/models"), faceapi.nets.ageGenderNet.loadFromUri("/assets/lib/face-api/models"), faceapi.nets.ssdMobilenetv1.loadFromUri("/assets/lib/face-api/models")]).then(startVideo);

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
                let timerInterval;
                Swal.fire({
                    title: "Você será redirecionado",
                    html: "Em breve você será redirecionado para a Página de login",
                    timer: 3000,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    closeOnClickOutside: false,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    },
                }).then((result) => {
                    /* Read more about handling dismissals below */
                    if (result.dismiss === Swal.DismissReason.timer) {
                        window.location.href = `index.php?usuario=${label}`;
                    }
                });
                contador += 1;
            }
        });
    }, 100);
});
