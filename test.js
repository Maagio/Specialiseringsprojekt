"use strict";
//import {promises} from "fs";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
let jimp = require('jimp');
let tf = require("@tensorflow/tfjs");
let fs = require("fs");
require("@tensorflow/tfjs-node");
let labels = [];
let testLabels = [];
//let network;
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        let test = yield trainingSetPrep();
        //console.log(test);
        let trainingData = yield tf.tensor4d(test);
        let network = yield createModel();
        yield train(network, trainingData);
        //network = await tf.loadModel("localstorage://my-model-1");
    });
}
exports.start = start;
function testing() {
    return __awaiter(this, void 0, void 0, function* () {
        let test2 = yield testSetPrep();
        let testData = yield tf.tensor4d(test2);
        //await runTest(network, testData);
    });
}
exports.testing = testing;
function noPost() {
    return __awaiter(this, void 0, void 0, function* () {
        let test = yield trainingSetPrep();
        //console.log(test);
        let trainingData = yield tf.tensor4d(test);
        let network = yield createModel();
        yield train(network, trainingData);
        //network = await tf.loadModel("localstorage://my-model-1");
        let test2 = yield testSetPrep();
        let testData = tf.tidy(() => {
            let x = tf.tensor4d(test2);
            return x;
        });
        yield runTest(network, testData);
    });
}
exports.noPost = noPost;
function imageHandler(path) {
    return new Promise(resolve => {
        //console.log(path);
        jimp.read(path, (err, imge) => {
            imge
                .resize(28, 28)
                .quality(100);
            let arr = [];
            for (let i = 0; i < 28; i++) {
                let testArr = [];
                for (let j = 0; j < 28; j++) {
                    let imageArr = [];
                    imageArr.push(numToBit(jimp.intToRGBA(imge.getPixelColor(i, j)).r));
                    imageArr.push(numToBit(jimp.intToRGBA(imge.getPixelColor(i, j)).g));
                    imageArr.push(numToBit(jimp.intToRGBA(imge.getPixelColor(i, j)).b));
                    testArr.push(imageArr);
                }
                //arr = [];
                arr.push(testArr);
            }
            //console.log(arr);
            //return arr;
            resolve(arr);
        });
    });
}
//Tager værdien og presser den ned mellem 0 og 1
function numToBit(value) {
    let min = 0;
    let max = 255;
    const num = (value - min) / (max - min);
    return Number((num).toFixed(6));
}
exports.numToBit = numToBit;
function createModel() {
    const model = tf.sequential();
    //create the first layer
    model.add(tf.layers.conv2d({
        inputShape: [28, 28, 3],
        kernelSize: 5,
        filters: 20,
        strides: 1,
        activation: 'relu',
        useBias: true,
        kernelInitializer: 'VarianceScaling'
    }));
    //create a max pooling layer
    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }));
    //create the second conv layer
    model.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 20,
        strides: 1,
        activation: 'relu',
        useBias: true,
        kernelInitializer: 'VarianceScaling'
    }));
    //create a max pooling layer
    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }));
    //flatten the layers to use it for the dense layers
    model.add(tf.layers.flatten());
    //dense layer with output 10 units
    model.add(tf.layers.dense({
        units: 2,
        kernelInitializer: 'VarianceScaling',
        activation: 'softmax'
    }));
    //const LEARNING_RATE = 0.0001;
    const optimizer = tf.train.sgd(0.001);
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy'
    });
    return model;
}
function trainingSetPrep() {
    return __awaiter(this, void 0, void 0, function* () {
        let pixelsOfAllImages = [];
        for (let i = 0; i < 200; i++) {
            let cat = yield imageHandler("Pictures/training_set/cats/cat." + (i + 1).toString() + ".jpg");
            let dog = yield imageHandler("Pictures/training_set/dogs/dog." + (i + 1).toString() + ".jpg");
            pixelsOfAllImages.push(cat);
            labels.push(0);
            pixelsOfAllImages.push(dog);
            labels.push(1);
        }
        //var test = await imageHandler("Pictures/Training/Tvs/tv1.jpg");
        //console.log(pixelsOfAllImages[0]);
        //console.log(pixelsOfAllImages.length);
        //labels = tf.tensor1d(label);
        return pixelsOfAllImages;
        //tf.tensor4d([pixelsOfAllImages]);
    });
}
function testSetPrep() {
    return __awaiter(this, void 0, void 0, function* () {
        let pixelsOfAllImages = [];
        for (let i = 0; i < 10; i++) {
            let cat = yield imageHandler("Pictures/test_set/cats/cat." + (i + 4001).toString() + ".jpg");
            let dog = yield imageHandler("Pictures/test_set/dogs/dog." + (i + 4001).toString() + ".jpg");
            pixelsOfAllImages.push(cat);
            testLabels.push(0);
            pixelsOfAllImages.push(dog);
            testLabels.push(1);
        }
        //console.log(image);
        /*let imageBuffer = await Buffer.from(image, "base64");
        console.log(imageBuffer);
        let read = new fs.readFileSync("Pictures/Testing/test1.jpg",function (err, data) {
            //if (err) throw err;
            //console.log(data);
        });
        console.log(read);
        new fs.writeFileSync("imageTest.jpg", imageBuffer, function (err) {
            if (err) throw err;
            console.log("File saved");
        })
        let test = await imageHandler(image);
        pixelsOfAllImages.push(test);
        testLabels.push(1);*/
        return pixelsOfAllImages;
    });
}
function train(network, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let labelData = yield tf.oneHot(tf.tensor1d(labels, "int32"), 2);
        yield network.fit(data, labelData, {
            batchSize: 10,
            epochs: 20,
            shuffle: true,
            validationSplit: 0.05
        }).then(results => {
            console.log(results);
        });
        //network.save("localstorage://my-model-1");
    });
}
function runTest(model, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let labelData = yield tf.oneHot(tf.tensor1d(testLabels, "int32"), 2);
        let prediction = yield model.predict(data);
        prediction.print();
        let values = yield prediction.argMax(1).dataSync();
        console.log(values);
        for (let i = 0; i < values.length; i++) {
            if (values[i] == testLabels[i]) {
                console.log("Korrekt");
            }
            else {
                console.log("Forkert");
            }
        }
    });
}
//# sourceMappingURL=test.js.map
