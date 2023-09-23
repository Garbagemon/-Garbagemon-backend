require("dotenv").config();

const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");

var jsonParser = bodyParser.json({ limit: 52428800 });

const app = express();
const port = +process.env.PORT;
const allowedOrigins = ["http://localhost:3000"];

// allow external requests
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(jsonParser);

app.get("/health-check", async (req, res) => {
    console.log(`Example app listening on port ${port}`);
    res.status(200).json({
        status: "OK",
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
