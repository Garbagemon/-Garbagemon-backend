const express = require("express");
const echo3DRouter = express.Router();

const AWS = require("aws-sdk");
AWS.config.update({ region: "your-region" });

const dynamodb = new AWS.DynamoDB();

//echo3d - faiyaz's api key
const echo3DApiKey = "icy-heart-6014";

////////1. gets user's garbage points from the database using their ID
const userID =  function getUserID(/*put outh code here to get user id*/ ){}

//call db and get the points
function getUserGarbagePoints(userID) {
  
    //update the code here to extract data from the table
    const params = {
    TableName: "garbagemon_userdata",
    Key: {
      UserID: { S: userID },
    },
  };

  //get the user's points
  dynamodb.getItem(params, (err, data) => {
    if (err) {
      
        console.error("Error fetching user points:", err);
    } else {
      
        //retrieve the data from the data table, parse it in any way //////////
        const points = parseInt(data.Item.Points.N);
        
        //if points are retrieved, then render the object
        renderEcho3DObject(points);

    }
  });

}

//use axios to call echo3d api
const axios = require('axios');

//function to render the trash model
function renderEcho3DObject(userPoints) {
    
    // scale factor 
    const scaleFactor = userPoints * 0.1;
  
    //echo3d - faiyaz's api key
    const echo3dApiKey = 'icy-heart-6014';
    const echo3dEndpoint = 'https://api.echo3d.co/v1/render';
  
    // request data parameters ////replace url of the model (trash bag)
    const requestData = {
      apiKey: echo3dApiKey,
      model: '3D MODEL URL/////////////////////',
      scale: scaleFactor,
    };
  
    // api request for echo3d
    axios.post(echo3dEndpoint, requestData)
      .then((response) => {
        
        // render object is created here
        const renderedObject = response.data.renderedObject;
        console.log('Rendered 3D Object:', renderedObject);
      })
      .catch((error) => {
        console.error('Error rendering 3D object:', error);
      });
}
  
// function to call points and render model
retrieveUserPointsAndRender();

echo3DRouter.get("/", function (req, res) {
    res.send("Get users controller");
});

echo3DRouter.get("/faiyaz", function (req, res) {
    res.send("Get users controller");
});

module.exports = echo3DRouter;
