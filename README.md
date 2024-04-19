# Northcoders News API

Finished project link: https://northcoders-news-api-bjpy.onrender.com/

Summary:
    This project was to prove my learning about back-end development and I had to create an api that allows you to go to different endpoints and receive the data specified by the endpoints, and also delete and add objects in the data folders.
    I used PSQL and TDD to achieve the outcome and then I hosted the webiste using Render and ElephantSQL.

How to clone:
    To clone the repo you click the code button and copy the link to your clipboard and then make a new file and then in your terminal type
    "git init"(without the ""), and then type "git clone <"url from clipboard">".
   
Get into the file and install dependencies:
    You then need to type "cd Northcoders-News-api" and now you will be in the file.
    Now type "npm i" and let it install.

Create the .env files:
    To make this api run you must add two files to the top level of the folder, one called .env.development and the other is called .env.test .
    Inside of the .env.development file you should insert this line of code: PGDATABASE=nc_news
    and inside of the .env.test file you should insert this line of code: PGDATABASE=nc_news_test.

Seed the database:
    Now type "npm run setup-db" to seed the database.
    And now you can run all the tests with "npm run test".

Minimum versions:
    The minimum versions of should be: Node.js: "v21.6.2", and Postgres: "^8.7.3"