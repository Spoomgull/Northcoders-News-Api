const express = require("express")

const app = express()

const {getTopics, getEndpoints, getArticles, getAllArticles, getComments, postComment, patchArticle} = require("./controller")

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api",getEndpoints)

app.get("/api/articles/:article_id",getArticles)

app.get("/api/articles",getAllArticles)

app.get("/api/articles/:article_id/comments",getComments)

app.post("/api/articles/:article_id/comments",postComment)

app.patch("/api/articles/:article_id",patchArticle)



app.use((err, req, res, next) => {
  if(err.code==="22P02"){return res.status(400).send({msg:"Invalid query params!!"})}
  next(err)
})
app.use((err,req,res,nest) => {
  if(err.code==="23503"){return res.status(400).send({msg:"Invalid query params!!"})}
  next(err)
})
app.use((err,req,res,next)=>{
  return res.status(400).send({msg:"Invalid query params!!"})
})


app.use((req, res, next) => {
    return res.status(404).send({msg:"Sorry can't find that!!"})
  })

  
  
  
  
  

module.exports = app