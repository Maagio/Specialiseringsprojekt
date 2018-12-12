import {start, testing} from "./test";

let path = require("path");
let express = require("express");
let bodyParser = require("body-parser");
let logger = require("morgan");
let app = express();

app.use(logger("dev"));
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json({limit: "10mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "10mb", extended: true}));

app.get("/", function (req, res) {
    res.sendFile("index.html", {root: __dirname});
});

app.post("/training", async function(req, res) {
    try{
        console.log("Træning begyndt");
        await start();
        console.log("Træning fuldført");
    } catch (e) {
        console.log(e.message);
    }
});

app.post("/testing", async  function(req, res) {
    try{
        console.log("Testing påbegyndt");
        //console.log(req.body.image);
        await testing();
    } catch (e) {
        console.log(e.message);
    }
});

app.listen(3000);
console.log("listening on port 3000");
