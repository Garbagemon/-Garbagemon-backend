require("dotenv").config;
var { marshalItem, unmarshalItem } = require("dynamodb-marshaler");

function insertItemPromise(dynamoDB, dynamoDBParamsToBeUploaded) {
    const dynamoDBParams = {
        TableName: process.env.DYNAMODB_USERDATA_DB,
        Item: marshalItem(dynamoDBParamsToBeUploaded),
    };

    return new Promise((resolve, reject) => {
        dynamoDB.putItem(dynamoDBParams, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function getItemPromise(dynamoDB, dynamoDBQueryParams) {
    const dynamoDBParams = {
        TableName: process.env.DYNAMODB_USERDATA_DB,
        Key: marshalItem(dynamoDBQueryParams),
    };

    return new Promise((resolve, reject) => {
        dynamoDB.getItem(dynamoDBParams, (err, data) => {
            if (err) {
                reject(err);
            } else if (typeof data.Item === "undefined" || typeof data.Item.collection === "undefined") {
                resolve({ collection: {} });
            } else {
                const formattedData = unmarshalItem(data.Item);
                resolve(formattedData);
            }
        });
    });
}

function mergeUserData(existingData, newData) {
    Object.keys(newData).forEach((key) => {
        if (!existingData[key]) existingData[key] = 0;
        existingData[key] += newData[key];
    });

    return existingData;
}

module.exports = {
    insertItemPromise,
    getItemPromise,
    mergeUserData,
};
