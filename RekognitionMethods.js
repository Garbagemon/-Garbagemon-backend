function getRekognitionInfPromise(rekognition, params) {
    return new Promise((resolve, reject) => {
        rekognition.detectLabels(params, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            const rekognitionResult = data.Labels;

            const namesWithCounts = {};

            rekognitionResult.forEach((label) => {
                const { Name } = label;

                if (!namesWithCounts[Name]) namesWithCounts[Name] = 0;
                namesWithCounts[Name] += 1;
            });

            resolve(namesWithCounts);
        });
    });
}

module.exports = {
    getRekognitionInfPromise,
};
