import cv from "opencv4nodejs";
import fs from "fs";
import path from "path";

const classificacao = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

// FUNÇÃO PARA TRANSFORMAR A IMAGEM EM PRETO E BRANCO
const getFaceImage = (grayImage) => {
    const reacoesFaciais = classificacao.detectMultiScale(grayImage).objects;

    if (!reacoesFaciais.length) {
        throw new Error("Nenhum rosto foi encontrado na imagem");
    }
    return grayImage.getRegion(reacoesFaciais[0]);
};

// PEGA O DIRETÓRIO DAS FOTOS QUE FORAM TIRADAS ANTERIORMENTE
const basePath = "./images_db";
const subjectsPath = path.resolve(basePath, "subjects");
const nomesMapeados = ["gabriel", "conan"];
const allFiles = fs.readdirSync(subjectsPath);

const images = allFiles
    .map((file) => path.resolve(subjectsPath, file))
    .map((filepath) => cv.imread(filepath))
    .map((image) => image.bgrToGray())
    .map(getFaceImage)
    .map((faceImg) => faceImg.resize(100, 100));

const isTargeImage = (_, i) => allFiles[i].includes("111");
const imagemTreinamento = (_, i) => !isTargeImage(_, i);

const imagensTreino = images.filter(imagemTreinamento);
const imagensTeste = images.filter(isTargeImage);

const labels = allFiles.filter(imagemTreinamento).map((file) => nomesMapeados.findIndex((name) => file.includes(name)));

const lbph = new cv.LBPHFaceRecognizer();
lbph.train(imagensTreino, labels);

const runPrediction = (recognizer) => {
    imagensTeste.forEach((img) => {
        console.log(img);
        const result = recognizer.predict(img);
        confValue = result.confidence;
        console.log(`predicted: ${nomesMapeados[result.label]}, confidence: ${result.confidence}`);
        cv.imshowWait("face", img);
        cv.destroyAllWindows();
    });
};

console.log("LBPH:");
runPrediction(lbph);
