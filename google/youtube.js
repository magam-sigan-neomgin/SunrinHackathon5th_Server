const request = require('request');
const GOOGLE_API = require('./google.json')

var exports = module.exports = {};

module.exports.getSadVideos = () => {
    return new Promise((resolve, reject) => {
        let options = { uri: 'https://www.googleapis.com/youtube/v3/search', qs: {key: GOOGLE_API.key, part: 'snippet', q: '슬픈노래'} };
        request(options, (error, response, body) => {
            resolve(JSON.parse(body));
        });
    });
}

module.exports.getAsmrWithPage = (page) => {
    return new Promise((resolve, reject) => {
        getAsmr(page, 1, null).then((bodyObject) => {
            resolve(bodyObject);
        })
    })
}
module.exports.getAsmrWithToken = (token) => {
    return new Promise((resolve, reject) => {
        let options = {uri: 'https://www.googleapis.com/youtube/v3/search', qs: {key: GOOGLE_API.key, part: 'snippet', q: 'asmr', pageToken: token}};
        request(options, (error, response, body) => {
            resolve(JSON.parse(body));
        });
    });
}
module.exports.getWhiteNoiseWithPage = (page) => {
    return new Promise((resolve, reject) => {
        getWhiteNoise(page, 1, null).then((bodyObject) => {
            resolve(bodyObject);
        })
    })
}
module.exports.getWhiteNoiseWithToken = (token) => {
    return new Promise((resolve, reject) => {
        let options = {uri: 'https://www.googleapis.com/youtube/v3/search', qs: {key: GOOGLE_API.key, part: 'snippet', q: 'white noise', pageToken: token}};
        request(options, (error, response, body) => {
            resolve(JSON.parse(body));
        });
    })
}

function getAsmr(maxPage, nowPage, nextToken) {
    return new Promise((resolve, reject) => {
        let options;
        if (nowPage == 1) {
            options = {uri: 'https://www.googleapis.com/youtube/v3/search', qs: {key: GOOGLE_API.key, part: 'snippet', q: 'asmr'}};
        }
        else {
            options = {uri: 'https://www.googleapis.com/youtube/v3/search', qs: {key: GOOGLE_API.key, part: 'snippet', q: 'asmr', pageToken: nextToken}};
        }
        request(options, (error, response, body) => {
            let bodyObject = JSON.parse(body);
            if (nowPage == maxPage) {
                resolve(bodyObject);
            }
            else {
                nextToken = bodyObject['nextPageToken'];
                getAsmr(maxPage, nowPage + 1, nextToken).then((thenBodyObject) => { resolve(thenBodyObject); });
            }
        });
    })
}

function getWhiteNoise(maxPage, nowPage, nextToken) {
    return new Promise((resolve, reject) => {
        let options;
        if (nowPage == 1) {
            options = {uri: 'https://www.googleapis.com/youtube/v3/search', qs: {key: GOOGLE_API.key, part: 'snippet', q: 'white noise'}};
        }
        else {
            options = {uri: 'https://www.googleapis.com/youtube/v3/search', qs: {key: GOOGLE_API.key, part: 'snippet', q: 'white noise', pageToken: nextToken}};
        }
        request(options, (error, response, body) => {
            let bodyObject = JSON.parse(body);
            if (nowPage == maxPage) {
                resolve(bodyObject);
            }
            else {
                nextToken = bodyObject['nextPageToken'];
                getAsmr(maxPage, nowPage + 1, nextToken).then((thenBodyObject) => { resolve(thenBodyObject); });
            }
        });
    })
}