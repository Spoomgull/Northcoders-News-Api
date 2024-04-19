const express = require("express")

const app = express()

const {getTopics, getEndpoints, getArticleById, getAllArticles, getComments, postComment, patchArticle, deleteComment,getUsers} = require("./controller")

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api",getEndpoints)

app.get("/api/articles/:article_id",getArticleById)

app.get("/api/articles",getAllArticles)

app.get("/api/articles/:article_id/comments",getComments)

app.post("/api/articles/:article_id/comments",postComment)

app.patch("/api/articles/:article_id",patchArticle)

app.delete("/api/comments/:comment_id",deleteComment)

app.get("/api/users",getUsers)




app.use((err, req, res, next) => {
  if(err.code==="22P02"){return res.status(400).send({msg:"Invalid query type!!"})}
  next(err)
})
app.use((err,req,res,nest) => {
  if(err.code==="23503"){return res.status(400).send({msg:"Invalid query params!!"})}
  next(err)
})
app.use((err,req,res,next)=>{
  if(err.code===""){return res.status(400).send({msg:"Invalid query params!!"})}
  else{next()}
})


app.use((req, res, next) => {
    return res.status(404).send({msg:"Sorry can't find that!!"})
  })

  
  
  
  
  

module.exports = app