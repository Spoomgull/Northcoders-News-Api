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
 
    if(body===undefined||article_id===undefined||author===undefined){
        console.log("hello")
       return err
    }

    return db.query(`SELECT username FROM users WHERE name =$1`,[author]).then(({rows})=>{
        if(rows.length===0){return Promise.reject({status:400,msg:"help"})}
        const { username } = rows[0]
        return db.query(
            `INSERT INTO comments
            (body, article_id, author)
            VALUES
            ($1, $2, $3)
            RETURNING *;
            `, [body, article_id, username])
        })
    }