const { Console } = require("console")
const db = require("../db/connection.js")
const fs = require("fs/promises")




exports.selectAllTopics = ()=>{
    return db.query(`SELECT * FROM topics;`)
}

exports.readEndpoints = ()=>{
    return fs.readFile(`./endpoints.json`,"utf-8").then((data)=>{return data})
}

exports.selectSpecifiedArticle = (id)=>{
        return db.query(`SELECT COUNT(*) AS comment_count FROM comments WHERE article_id = $1`,[id]).then(({rows})=>{
         const {comment_count} = rows[0]
        return db.query(`SELECT *, $1 AS comment_count FROM articles WHERE article_id = $2`,[comment_count,id])
          })
}

exports.selectAllArticles = (query)=>{    
    let querystr = `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, count(*) AS comment_count FROM articles
     JOIN comments ON comments.article_id = articles.article_id `

    const queryVar = []
    if(Object.keys(query).length>0){
        if(query.topic===undefined){throw err}
        queryVar.push(query.topic)
        querystr+= `WHERE topic = $${queryVar.length} `
    }
    querystr+= `GROUP BY articles.article_id ORDER BY articles.created_at DESC`
    return db.query(querystr,queryVar)
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

exports.selectAllUsers = ()=>{
    return db.query(`SELECT * FROM users`)
}