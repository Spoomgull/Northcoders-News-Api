const db = require("../db/connection.js")
const fs = require("fs/promises")




exports.selectAllTopics = () => {

    return db.query(`SELECT * FROM topics;`)
}

exports.readEndpoints = ()=>{
    return fs.readFile(`./endpoints.json`,"utf-8").then((data)=>{return data})
}

exports.selectAllArticles = (id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1`,[id])
}

