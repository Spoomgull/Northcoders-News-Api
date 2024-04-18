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
    return db.query(`SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, count(*) AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`)
}

exports.selectSpecifiedComments = (id)=>{
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,[id])
}

exports.updateComments = (comment,id)=>{

    const {body} = comment
    const {article_id} = id
    const author = comment.username

    if(!body||!article_id||!author){
       return err
    }
    
        return db.query(
            `INSERT INTO comments
            (body, article_id, author)
            VALUES
            ($1, $2, $3)
            RETURNING *;
            `, [body, article_id, author])
     
        }

exports.updateArticle = (id, inc_votes)=>{
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,[inc_votes,id])
}

exports.deleteFromComments = (id)=>{
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`,[id])
}