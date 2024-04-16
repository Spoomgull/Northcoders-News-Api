const express = require("express")

const app = express()

const {getTopics, getEndpoints, getArticles, getAllArticles} = require("./controller")

app.get("/api/topics", getTopics)

app.get("/api",getEndpoints)

app.get("/api/articles/:article_id",getArticles)

app.get("/api/articles",getAllArticles)






app.use((req, res, next) => {
    res.status(404).send({msg:"Sorry can't find that!!"})
  })

module.exports = app