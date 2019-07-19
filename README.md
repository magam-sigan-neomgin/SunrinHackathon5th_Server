# SunrinHackathon5th Server  

# API  

**BASE URL** : `http://54.180.57.73:3000`

## Register Account 

**URL** : `/register` 

**Method** : `POST` 

**Auth required** : NO 

**Request body example** 

```json
{
    "id": "testId",
    "pw": "testPw",
    "username": "testUserName",
    "photo": "[multipart/formdata]"
}
``` 

**Succeeded Response example** 

```json
{
    "status": true
}
``` 

**Failed Response example** 

```json
{
    "status": false,
    "message": "Id duplicated"
}
``` 

## Login Account 

**URL** : `/login` 

**Method** : `POST` 

**Auth required** : NO 

**Request Query example** 

```
/login?id=testId&pw=testPw
``` 

**Succeeded Response example** 

```json
{
    "status": true,
    "id": "testId",
    "username": "testUserName"
}
``` 

**Failed Response example** 

```json
{
    "status": false,
    "message": "Authenticated failed"
}
``` 

## Login Status 

**URL** : `/status` 

**Method** : `GET` 

**Auth required** : YES 

**Succeeded Response example** 

```json
{
    "status": true,
    "id": "testId",
    "username": "testUserName"
}
``` 


**Failed Response example** 

```json
{
    "status": false,
    "message": "Authenticated failed"
}
``` 

## Get Board 

**URL** : `/board` 

**Method** : `GET` 

**Auth required** : NO 

**Succeeded Response example** 

```json
{
    "status": true,
    "board": [
        {
            "id": 1,
            "title": "testTitle",
            "content": "test content",
            "photo": "testPhoto.jpg",
            "author": "UserA",
            "is_shared": 0,
            "likes": [
                {
                    "id": 1,
                    "user_id": "testId"
                },
                {
                    "id": 2,
                    "user_id": "testId2"
                }
            ],
            "suggest": {"youtube api"}
        },
        {
            "id": 2,
            "content": "test content2",
            "photo": "testPhoto2.png",
            "likes": [],
            "is_shared": 1,
            "suggest": {"youtube api"}
        }
    ]
}
``` 

> photo는 https://good-night-board-image-bucket.s3.ap-northeast-2.amazonaws.com/ 뒤에 붙인다. 

## Add Board 

**URL** : `/board/add` 

**Method** : `POST` 

**Auth required** : YES 

**Request body example** 

```json
{
    "title": "testTitle",
    "content": "testContent",
    "photo": "[multipart/formdata]",
    "emotion": "[sad/...]"
}
``` 

**Succeeded Response example** 

```json
{
    "status": true
}
``` 


**Failed Response example** 

```json
{
    "status": false,
    "message": "Authenticated failed"
}
``` 

## Get My Board 

**URL** : `/board/my` 

**Method** : `GET` 

**Auth required** : YES 

**Succeeded Response example** 

```json
{
    "status": true,
    "board": [
        {
            "id": 1,
            "title": "testTitle",
            "content": "test content",
            "photo": "testPhoto.jpg",
            "author": "UserA",
            "likes": [
                {
                    "id": 1,
                    "user_id": "testId"
                },
                {
                    "id": 2,
                    "user_id": "testId2"
                }
            ],
            "suggest": {"youtube api"}
        },
        {
            "id": 2,
            "content": "test content2",
            "photo": "testPhoto2.png",
            "likes": [],
            "suggest": {"youtube api"}
        }
    ]
}
``` 


**Failed Response example** 

```json
{
    "status": false,
    "message": "Authenticated failed"
}
``` 

## Board Share 

**URL** : `/board/share` 

**Method** : `POST` 

**Auth required** : NO 

**Request body example** 

```json
{
    "id": "1"
}
``` 

**Succeeded Response example** 

```json
{
    "status": true
}
``` 

## Add Comment 

**URL** : `/board/comment` 

**Method** : `POST` 

**Auth required** : YES 

**Request body example** 

```json
{
    "id": "1",
    "comment": "TestComment"

}
``` 

**Succeeded Response example** 

```json
{
    "status": true
}
``` 

**Failed Response example** 

```json
{
    "status": false,
    "message": "Authenticated failed"
}
``` 