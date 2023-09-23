require("dotenv").config();

const express = require("express");

const cors = require("cors");
var bodyParser = require("body-parser");

var jsonParser = bodyParser.json({ limit: 52428800 });

const app = express();
const port = +process.env.PORT;
const allowedOrigins = ["http://localhost:3000"];

const AWS = require("aws-sdk");
const echo3DRouter = require("./echo3dRoute");

AWS.config.update({
    region: process.env.AWS_REGION, // Change to your preferred region
});

const rekognition = new AWS.Rekognition();

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
app.use("/echo3d", echo3DRouter);

app.get("/health-check", async (req, res) => {
    console.log(`Example app listening on port ${port}`);
    res.status(200).json({
        status: "OK",
    });
});

app.post("/recognize", (req, res) => {
    const base64Image = req.body.image; // Get the base64 encoded image from the request body

    if (!base64Image)
        return res.status(400).json({
            code: 400,
            message: "error: failed to provide an image in request body",
        });

    const params = {
        Image: {
            Bytes: Buffer.from(base64Image, "base64"), // Convert base64 string to binary buffer
        },
        MinConfidence: 50,
    };

    rekognition.detectLabels(params, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "error: An error occurred with rekognition" });
        }

        const rekognitionResult = data.Labels;

        const namesWithCounts = {};

        rekognitionResult.forEach((label) => {
            const { Name } = label;

            if (!namesWithCounts[Name]) namesWithCounts[Name] = 0;
            namesWithCounts[Name] += 1;
        });

        res.status(200).json(namesWithCounts);
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
