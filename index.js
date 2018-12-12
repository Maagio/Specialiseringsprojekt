"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//import {start} from "./test";
//import {log} from "util";
const test_1 = require("./test");
let path = require("path");
let express = require("express");
let bodyParser = require("body-parser");
let logger = require("morgan");
let app = express();
app.use(logger("dev"));
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.get("/", function (req, res) {
    res.sendFile("index.html", { root: __dirname });
});
app.post("/training", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Træning begyndt");
            yield test_1.start();
            console.log("Træning fuldført");
        }
        catch (e) {
            console.log(e.message);
        }
    });
});
app.post("/testing", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Testing påbegyndt");
            //console.log(req.body.image);
            yield test_1.testing();
        }
        catch (e) {
            console.log(e.message);
        }
    });
});
app.listen(3000);
console.log("listening on port 3000");
//# sourceMappingURL=index.js.map
