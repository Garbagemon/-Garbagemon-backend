const express = require("express");
const echo3DRouter = express.Router();

echo3DRouter.get("/", function (req, res) {
    res.send("Get users controller");
});

echo3DRouter.get("/faiyaz", function (req, res) {
    res.send("Get users controller");
});

module.exports = echo3DRouter;
