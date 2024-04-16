const db = require("../db/connection.js")
const fs = require("fs/promises")




exports.selectAllTopics = ()=>{

    return db.query(`SELECT * FROM topics;`)
}

exports.readEndpoints = ()=>{
    return fs.readFile(`./endpoints.json`,"utf-8").then((data)=>{return data})
}

exports.selectSpecifiedArticle = (id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1`,[id])
}

exports.selectAllArticles = ()=>{    
    return (db.query(`SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, count(*) AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`))
}

