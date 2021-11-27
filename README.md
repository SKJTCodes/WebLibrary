# WebLibrary
A Centralize Web app that allows us to browse our comic collection and video collection

## Initialize
1. run 'npm install' in both frontend and backend folder.
2. create a mysql server and create backend/.env file accordingly
3. There are template comics for us to use. but we need to create a database for them first, data is in backend CREATE_TABLE.txt. Use this info to create the tables required.
4. use INSERT_DEVEL_*.txt to insert the values for each table.
5. create frontend/.env with your local machine IP address

## .env examples.
1. Create frontend/.env file
```javascript
DB_NAME=test
DB_HOST=localhost
DB_USER=mysql_username
DB_PWD=password!@#
PORT=3222
```
2. Create backend/.env file
```javascript
REACT_APP_DOMAIN=http://192.168.1.1:3222/
```

## Start-up
1. in frontend, run 'npm start'
2. in backend, run 'npm start'
3. access the website by typing localhost:3221 to access the front end. The front end will communicate with the backend, therefore we only need to access the frontend.