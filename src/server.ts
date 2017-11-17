import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import * as csurf from "csurf";

import { DummyDataSource } from "./dummyDataSource";
const dataSource = new DummyDataSource();

const app = express();
const csrfProtection = csurf({ cookie: true });

app.use(logger("dev"));

app.use(cookieParser());

/*
app.get(/^\/(index.html)?$/, csrfProtection, (req, res, next) => {
    let token = req.csrfToken();
    res.cookie("XSRF-TOKEN", token, { httpOnly: false });
    next();
});
*/

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(function (err, req, res, next) {
    if (err.code !== "EBADCSRFTOKEN") return next(err);
    res.status(403).end("forbidden");
});


app.post("/api/GetNewer", /*csrfProtection,*/ async (req, res) => {
    let lpnOrMobile = req.body.lpnOrMobile;
    let maxId = req.body.maxId;
    // res.cookie("XSRF-TOKEN", req.csrfToken());
    let notices = await dataSource.getNewNoticeByLPNAndMaxId(lpnOrMobile, maxId);
    res.json(notices);
});

app.get("*", (req, res) => {
    console.log(req.url);
    res.status(404).end("Not found");
});



process.on("exit", () => {
    console.log("cleaning up...");
    dataSource.dispose();
});
process.on("SIGINT", () => { process.exit(); });

(async () => {
    await dataSource.initialize();
    app.listen(3000, () => {
        console.log("server listening on port 3000");
    });
})();
