// let camera_button = document.querySelector("#start-camera");
// let video = document.querySelector("#video");
// let click_button = document.querySelector("#click-photo");
// let canvas = document.querySelector("#canvas"); // aqui que eu vou pegar a imagem
// let imageUpload = document.getElementById("imageUpload"); // aqui que eu vou pegar a imagem
// let dataImageUrl = "";

// Promise.all([faceapi.nets.faceRecognitionNet.loadFromUri("/models"), faceapi.nets.faceLandmark68Net.loadFromUri("/models"), faceapi.nets.ssdMobilenetv1.loadFromUri("/models")]).then(start);

// function start() {
//     document.body.append("LOADED");

//     camera_button.addEventListener("click", async function () {
//         let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
//         video.srcObject = stream;
//     });

//     click_button.addEventListener("click", async function () {
//         canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
//         let image_data_url = canvas.toDataURL("image/jpeg");

//         // data url of the image
//         // console.log(image_data_url);
//         dataImageUrl = await image_data_url;
//         imageUpload.value = dataImageUrl;

//         const image = await faceapi.bufferToImage(imageUpload.value);
//         console.log(image);

//         // imageUpload.addEventListener("change input", function () {
//         //     console.log("Image Upload");
//         //     // const image = await faceapi.bufferToImage(dataImageUrl);
//         //     // document.body.append(image);
//         //     // console.log(image);
//         //     // const detection = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
//         //     // document.body.append(detection.length);
//         // });
//     });
// }

const video = document.getElementById("video");

Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri("/models"), faceapi.nets.faceLandmark68Net.loadFromUri("/models"), faceapi.nets.faceRecognitionNet.loadFromUri("/models"), faceapi.nets.faceExpressionNet.loadFromUri("/models")]).then(startVideo);

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        (stream) => (video.srcObject = stream),
        (err) => console.error(err)
    );
}

video.addEventListener("play", () => {
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks());
    }, 1000);
});
