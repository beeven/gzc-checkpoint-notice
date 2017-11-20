import express = require("express");
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import logger = require("morgan");
import csurf = require("csurf");
import fs = require("fs");
import path = require("path");
import rfs = require("rotating-file-stream");

import { DummyDataSource } from "./dummyDataSource";
import { OracleDataSource } from "./oracleDataSource";
const dataSource = new OracleDataSource();

const app = express();
const csrfProtection = csurf({ cookie: true });

const config = require("./config.json");

// configure logging
const logDirectory = path.join(__dirname, "log")
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs("access.log", {
    interval: "10d", // rotates at 10 days
    size: '10M',
    path: logDirectory,
    compress: 'gzip'
});
app.use(logger("combined", {stream: accessLogStream}));


app.use(cookieParser());
if (config.enableXSRF) {
    app.get(/^\/(index.html)?$/, csrfProtection, (req, res, next) => {
        let token = req.csrfToken();
        res.cookie("XSRF-TOKEN", token, { httpOnly: false });
        next();
    });
}

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// configure routing

app.use(function (err, req, res, next) {
    if (err.code !== "EBADCSRFTOKEN") return next(err);
    res.status(403).end("forbidden");
});

const GetNewerFunction = async (req, res) => {
    let lpnOrMobile: string | null = req.body.lpnOrMobile;
    let maxId: number | null = req.body.maxId || 0;
    if (lpnOrMobile != undefined && lpnOrMobile.length < 5) {
        return res.status(400).end("Minimum length of lpnOrMobile is 5");
    }
    let notices = await dataSource.getNewNoticeByLPNOrMobileAndMaxId(lpnOrMobile, maxId);
    res.json(notices);
};

if (config.enableXSRF) {
    app.post("/api/GetNewer", csrfProtection, GetNewerFunction);
} else {
    app.post("/api/GetNewer", GetNewerFunction);
}

app.get("*", (req, res) => {
    res.status(404).end("Not found");
});



// handle exit 

process.on("exit", () => {
    console.log("cleaning up...");
    dataSource.dispose();
});
process.on("SIGINT", () => { process.exit(); });

(async () => {
    await dataSource.initialize();
    app.listen(config.server.port, config.server.address, () => {
        console.log("server listening on port", config.server.port);
    });
})();
