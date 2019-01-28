# loginServer
Express Login Server Exampled  
Passwords Encrypted By Bcrypt

# SQL
Mariadb  
id: localhost@test  
pw:  test  
database: test  
table: user (id varchar(64), pw varchar(64))  

# API 
### / 
> Express Main Page 

### /signin 
> Sign in page(if you already logged in, it will show your id and pw) if you success, redirect /success or redirect /failed

### /signout 
> Sign out and redirect /signin 

### /signup 
> Sign up if id duplicated, alert 
