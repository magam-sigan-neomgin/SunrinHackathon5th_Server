const request = require('request');
const GOOGLE_API = require('./google.json')

// key spare
// AIzaSyCfl5v33F5hAH7-KcSiGDFloBCtj8dFjXg
// AIzaSyBepOzk_CjnbBeNoOvmaSRfoJColfSwIYI

var exports = module.exports = {};

module.exports.getVideoByEmotion = (emotion) => {
    return new Promise((resolve, reject) => {
        if (emotion == 'sad') {
            let options = { uri: 'https://www.googleapis.com/youtube/v3/search', qs: {key: GOOGLE_API.key, part: 'snippet', q: '슬픈노래'} };
            request(options, (error, response, body) => {
                if (error) throw error;
                resolve(JSON.parse(body));
            });
        }
        else if (emotion == 'happy') {
            let options = { uri: 'https://www.googleapis.com/youtube/v3/search', qs: {key: GOOGLE_API.key, part: 'snippet', q: '신나는노래'} };
            request(options, (error, response, body) => {
                if (error) throw error;
                resolve(JSON.parse(body));
            });
        }
        else if (emotion == 'soso') {
            let options = { uri: 'https://www.googleapis.com/youtube/v3/search', qs: {key: GOOGLE_API.key, part: 'snippet', q: '잔잔한노래'} };
            request(options, (error, response, body) => {
                if (error) throw error;
                resolve(JSON.parse(body));
            });
        }
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