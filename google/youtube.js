const request = require('request');
const GOOGLE_API = require('./google.json')

var exports = module.exports = {};

module.exports.getAsmrWithPage = (page) => {
    return new Promise((resolve, reject) => {
        getAsmr(page, 1, null).then((body) => {
            resolve(body);
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