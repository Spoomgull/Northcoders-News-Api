const express = require("express")

const app = express()

const {getTopics, getEndpoints, getArticles, getAllArticles, getComments} = require("./controller")

app.get("/api/topics", getTopics)

app.get("/api",getEndpoints)

app.get("/api/articles/:article_id",getArticles)

app.get("/api/articles",getAllArticles)

app.get("/api/articles/:article_id/comments",getComments)




app.use((req, res, next) => {
    return res.status(404).send({msg:"Sorry can't find that!!"})
  })

module.exports = app