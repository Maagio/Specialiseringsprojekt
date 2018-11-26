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
//require("@tensorflow/tfjs-node");
let labels = [];
let testLabels = [];
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        let test = yield trainingSetPrep();
        //console.log(test);
        let trainingData = yield tf.tensor4d(test);
        let network = yield createModel();
        let test2 = yield testSetPrep();
        let testData = yield tf.tensor4d(test2);
        yield train(network, trainingData);
        yield runTest(network, testData);
    });
}
exports.start = start;
function imageHandler(path) {
    return new Promise(resolve => {
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
        filters: 8,
        strides: 1,
        activation: 'relu',
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
        filters: 16,
        strides: 1,
        activation: 'relu',
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
    const LEARNING_RATE = 0.0001;
    const optimizer = tf.train.sgd(LEARNING_RATE);
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });
    return model;
}
function trainingSetPrep() {
    return __awaiter(this, void 0, void 0, function* () {
        let pixelsOfAllImages = [];
        for (let i = 0; i < 9; i++) {
            var tv = yield imageHandler("Pictures/Training/Tvs/tv" + (i + 1) + ".jpg");
            var dog = yield imageHandler("Pictures/Training/Dogs/dog" + (i + 1) + ".jpg");
            pixelsOfAllImages.push(tv);
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
        let fixLater = 1;
        for (let i = 0; i < 3; i++) {
            var test = yield imageHandler("Pictures/Testing/test" + (i + 1) + ".jpg");
            pixelsOfAllImages.push(test);
            if (fixLater == 0) {
                testLabels.push(0);
            }
            else {
                testLabels.push(1);
            }
            fixLater = 0;
        }
        return pixelsOfAllImages;
    });
}
function train(network, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let labelData = yield tf.oneHot(tf.tensor1d(labels, "int32"), 2);
        yield network.fit(data, labelData, {
            batchSize: 4,
            epochs: 3,
            shuffle: true,
            validationSplit: 0.05
        }).then(results => {
            console.log(results);
        });
    });
}
function runTest(model, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let labelData = yield tf.oneHot(tf.tensor1d(testLabels, "int32"), 2);
        let prediction = yield model.predict(data);
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