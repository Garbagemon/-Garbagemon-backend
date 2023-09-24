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
const { getRekognitionInfPromise } = require("./RekognitionMethods");
const { insertItemPromise, getItemPromise, mergeUserData } = require("./DynamoDBMethods");

AWS.config.update({
    region: process.env.AWS_REGION, // Change to your preferred region
});

const rekognitionRef = new AWS.Rekognition();
const dynamodbRef = new AWS.DynamoDB();

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

app.post("/recognize", async (req, res) => {
    const base64Image = req.body.image; // Get the base64 encoded image from the request body
    const userId = req.body.userId; // Get the base64 encoded image from the request body

    if (!base64Image)
        return res.status(400).json({
            code: 400,
            message: "error: failed to provide an image in request body",
        });

    if (!userId)
        return res.status(400).json({
            code: 400,
            message: "error: failed to provide a userId in request body",
        });

    const rekognitionParams = {
        Image: {
            Bytes: Buffer.from(base64Image, "base64"), // Convert base64 string to binary buffer
        },
        MinConfidence: 50,
    };

    const rekognitionInf = getRekognitionInfPromise(rekognitionRef, rekognitionParams);

    try {
        await rekognitionInf;
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            code: 500,
            message: "error with AWS Rekognition",
        });
    }

    const rekognitionData = await rekognitionInf;

    const dynamoDBQueryParams = {
        userId,
    };

    const existingDataPromise = getItemPromise(dynamodbRef, dynamoDBQueryParams);

    try {
        await existingDataPromise;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ code: 500, message: "error with dyanmodb: download" });
    }

    const existingData = (await existingDataPromise).collection;

    const dynamoDBQParamsForUpload = {
        userId,
        collection: mergeUserData(existingData, rekognitionData),
    };

    try {
        await insertItemPromise(dynamodbRef, dynamoDBQParamsForUpload);
        return res.status(200).json({ code: 200, message: "OK" });
    } catch (error) {
        return res.status(500).json({ code: 500, message: "error with dyanmodb: upload" });
    }
});

app.get("/get-userdata", async (req, res) => {
    const userId = req.query.userId;

    if (!userId)
        return res.status(400).json({
            code: 400,
            message: "error: failed to provide a userId in query param",
        });

    const dynamoDBQueryParams = {
        userId,
    };

    const existingDataPromise = getItemPromise(dynamodbRef, dynamoDBQueryParams);

    try {
        const data = await existingDataPromise;
        return res.status(200).json({ code: 200, data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ code: 500, message: "error with dyanmodb: download" });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
