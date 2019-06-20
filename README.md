# Good_Night Server  


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
    "profileimage": "[multipart/form-data]"
}
``` 

**Succeeded Response example** 

```json
{
    "status": true
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
    "id": "testId"
}
``` 

**Failed Response example** 

```json
{
    "status": false,
    "message": "Authenticated failed"
}
``` 

## Write Board 

**URL** : `/writeboard` 

**Method**  :`POST` 

**Auth required** : YES 

**Request Body example** 

```json
{
    "title": "testTitle",
    "bodyText": "testBodyText",
    "photo": "[multipart/form-data]"
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

## Get Boards 

**URL** : `/getboards` 

**Method** : `GET` 

**Auth required** : NO 

**Succeeded Response example** 

```json
{
    "status": true,
    "data": [
        {
            "no": 2,
            "id": "a",
            "title": "TEST 3",
            "create_date": "2019-06-19T23:22:33.000Z",
            "body_text": "lorem ipsum is very long text aaaaa",
            "photo": "2.jpg",
            "likes": [
                "testId", "testId2"
            ]
        },
        {
            "no": 1,
            "id": "a",
            "title": "TEST 3",
            "create_date": "2019-06-19T15:52:43.000Z",
            "body_text": "lorem ipsum is very long text aaaaa",
            "photo": "1.jpg",
            "likes": []
        }
    ]
}
``` 

> photo는 https://good-night-board-image-bucket.s3.ap-northeast-2.amazonaws.com/ 뒤에 붙인다. 

## Click Like 

**URL** : `/clicklike` 

**Method** : `POST` 

**Auth required** : YES 

**Request Body example** 

```json
{
    "no": "1"
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

## Unclick Like 

**URL** : `/unclicklike` 

**Method** : `POST` 

**Auth required** : YES 

**Request Body example** 

```json
{
    "no": "1"
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