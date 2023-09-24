const express = require("express");
const echo3DRouter = express.Router();

//echo3d - faiyaz's api key
const echo3DApiKey = "icy-heart-6014";

////////1. gets user's garbage points from the database using their ID
const AWS = require("aws-sdk");
AWS.config.update({ region: "your-region" });

const dynamodb = new AWS.DynamoDB();
const userId =  "user-id"; 

//call db and get the points
function getUserGarbagePoints(userId) {
  
    //update the code here to extract data from the table
    const params = {
    TableName: "YourTableName",
    Key: {
      UserId: { S: userId },
    },
  };

  dynamodb.getItem(params, (err, data) => {
    if (err) {
      console.error("Error fetching user points:", err);
    } else {
      const points = parseInt(data.Item.Points.N);
      // Use the points to scale the 3D model in your Echo3D scene
      // You'll need to implement Echo3D-specific logic here.

      
    }
  });

}

//call the function
const garbageSizeScale = getUserGarbagePoints(userId) *= .1;

//2. function that access camera on computer 
const startCameraButton = document.getElementById("startCamera");
const videoElement = document.getElementById("videoElement");

// function to start the camera feed and initialize AR
async function initializeAR() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        await videoElement.play();

        //call echo3D api here 
        const echo3D = new Echo3D('icy-heart-6014'); 
        const modelId = 'fb60a80e-68c7-4f61-a853-84b370448118'; 

        const modelData = await echo3D.getModel(modelId);

        const scene = new THREE.Scene();

        const loader = new THREE.GLTFLoader();
        const model = await new Promise((resolve, reject) => {
            loader.load(modelData.url, resolve, undefined, reject);
        });

        scene.add(model.scene);

        //sets the scale of the model with the user's garbage points
        model.scene.scale.set(garbageSizeScale, garbageSizeScale, garbageSizeScale);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

    } catch (error) {
        console.error("Error accessing camera:", error);
    }
}

// Add a click event listener to the button to start AR
startCameraButton.addEventListener("click", initializeAR);


echo3DRouter.get("/", function (req, res) {
    res.send("Get users controller");
});

echo3DRouter.get("/faiyaz", function (req, res) {
    res.send("Get users controller");
});

module.exports = echo3DRouter;
