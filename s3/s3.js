const AWS = require('aws-sdk');
const S3_CONFIG = require('./s3.json');

const BUCKET_NAME = S3_CONFIG.bucketName;
const BUCKET_BOARD_PHOTO_NAME = S3_CONFIG.boardPhotoBucketName;
const BUCKET_REGION = S3_CONFIG.bucketRegion;
const IDENTITY_POOL_ID = S3_CONFIG.identityPoolId;

AWS.config.update({
    region: BUCKET_REGION,
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IDENTITY_POOL_ID
    })
});

let s3 = new AWS.S3({apiVersion: '2006-03-01', params: { Bucket: BUCKET_NAME }});
let s3BoardPhoto = new AWS.S3({apiVersion: '2006-03-01', params: { Bucket: BUCKET_BOARD_PHOTO_NAME }});

module.exports.upload = (key, data) => {
    s3.upload({
        Key: key,
        Body: data,
        ACL: 'public-read'
    }, (error, data) => {
        if (error) throw error;
        console.log(data);
    });
}

module.exports.uploadBoardPhoto = (key, data) => {
    s3BoardPhoto.upload({
        Key: key,
        Body: data,
        ACL: 'public-read'
    }, (error, data) => {
        if (error) throw error;
        console.log(data);
    });
}