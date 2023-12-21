## Usage Instructions
1) Clone this repository
```git clone https://github.com/KelfinTDetonator/Binar-challenge-chapter-7.git```
2) Create your .env in local repository (or you can see an example in env.sample file)
```
SECRET_KEY=
DATABASE_URL=
PORT=
USER=YOUR_EMAIL
EXP_IN_MINUTE=RESET_LINK_EXPIRY_TIME
PASS=GOOGLE_PASS
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CALLBACK_ENDPOINT=
```
3) ```npm install``` to install all packages provided in the package.json
4) ```npx prisma migrate dev``` or  ```npx prisma db push``` to migrate your database from prisma.schema
5) Update your .gitignore
```
node_modules
.env
README.md
.sentryclirc
```

## Showcase :tv:  
![Screenshot (1548)](https://github.com/KelfinTDetonator/Google-OAUTH2/assets/91953273/597adaf2-ef6a-4d74-9418-5c4286b70a24)  
:black_medium_square: Sign in with Google  
![Screenshot (1549)_LI](https://github.com/KelfinTDetonator/Google-OAUTH2/assets/91953273/b1b0ed40-79d6-4e6c-a439-681491ae8054)  
:black_medium_square: User has successfully authorized by Google    
![Screenshot (1550)](https://github.com/KelfinTDetonator/Google-OAUTH2/assets/91953273/e046eba1-47eb-4166-aed1-9322c0832992)  
:black_medium_square: User data in database  
![Screenshot (1551)_LI](https://github.com/KelfinTDetonator/Google-OAUTH2/assets/91953273/709688e9-7c6a-4226-8af4-ce079b5b1272)  

## Features :rocket:
:black_medium_square: User authentication and authorization using Google OAUTH  
:black_medium_square: Register/login user with JWT   

## Technologies Used :hammer:
:black_medium_square: Passport JS + Google OAUTH2 with JWT Auth  
:black_medium_square: Express JS  
:black_medium_square: Prisma ORM for PostgreSQL  
:black_medium_square: SQL Electron  
:black_medium_square: AWS RDS  
:black_medium_square: Git  

## What I learned :computer:
:black_medium_square: Creating and hosting a database in Amazon Web Services    
:black_medium_square: Implement Google OAUTH2 and handle its callback when user authorized by Google    
:black_medium_square: Handle data that Google needs to authorize a user  
