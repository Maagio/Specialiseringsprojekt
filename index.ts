//import {start} from "./test";
//import {log} from "util";
import {start} from "./test";

let path = require("path");
let express = require("express");
let logger = require("morgan");
let app = express();

app.use(logger("dev"));

app.use(express.static(path.join(__dirname)));

app.get("/", function (req, res) {
    res.sendFile("index.html", {root: __dirname});
})

app.post("/", async function(req, res) {
    try{
        console.log(req.body);
        await start();
    } catch (e) {
        console.log(e.message);
    }
});
app.listen(3000);
console.log("listening on port 3000");

//start();