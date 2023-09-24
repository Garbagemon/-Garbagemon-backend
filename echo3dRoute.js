const express = require("express");
const echo3DRouter = express.Router();

//echo3d - faiyaz's api key
const echo3DApiKey = "icy-heart-6014";

//gets user's garbage points from the database using their ID
const AWS = require("aws-sdk");
AWS.config.update({ region: "your-region" });

const dynamodb = new AWS.DynamoDB();
const userId =  1; //"user-id"; // Replace with the user's actual ID

function getUserPoints(userId) {
  /*const params = {
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
  });*/

  if (userId == 1){
    return 10;
  }
  else{
    return 0;
  }
}

getUserPoints(userId);




//function that access camera on computer 
const startCameraButton = document.getElementById("startCamera");
const videoElement = document.getElementById("videoElement");

// function to start the camera feed and initialize AR
async function initializeAR() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        await videoElement.play();

        // You can now add your AR initialization code here
        // This could include calling Echo3D and any other AR-related logic
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
