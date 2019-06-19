# Good_Night Server  
Express Login Server Exampled  
Passwords Encrypted By Bcrypt  

# API  

## Register Account 

**URL** `/register` 

**Method** `POST` 

**Auth required** NO 

**Request body example** 

```json
{
    "id": test1,
    "pw": test1
}
``` 

**Succeeded Response example** 

```json
{
    "status": true
}
``` 

## Login Account 

**URL** `/login` 

**Method** `POST` 

**Auth required** NO 

**Request Query example** 

```
    /login?id=test1&pw=test1
``` 

**Succeeded Response example** 

```json
{
    "status": true
}
``` 