const {selectAllTopics, readEndpoints, selectSpecifiedArticle, selectAllArticles, selectSpecifiedComments, updateComments} = require("./model.js")





exports.getTopics = (req,res,next) =>{


    selectAllTopics().then(({rows})=>{
  
  
        return res.status(200).send({topics:rows})
    })
}

exports.getEndpoints = (req,res,next) =>{

    readEndpoints().then((result)=>{

        const parsedEndpoints = JSON.parse(result)

        return res.status(200).send({endpoints:parsedEndpoints})
    })
}

exports.getArticles = (req,res,next) =>{

    const articleId = req.params.article_id

    selectSpecifiedArticle(articleId).then(({rows})=>{
        if(rows.length===0){return res.status(400).send({msg:"Invalid query params!!"})}
        
        return res.status(200).send({article:rows[0]})
    
    }).catch(({code})=>{
        if(code){
        next(code)}
    })
}

exports.getAllArticles = (req,res,next) =>{

    selectAllArticles().then(({rows})=>{
        rows.forEach((article)=>{article.comment_count=Number(article.comment_count)})
        return res.status(200).send({articles:rows})
    })
}

exports.getComments = (req,res,next) =>{

    const articleId = req.params.article_id

    selectSpecifiedComments(articleId).then(({rows})=>{
        const comments = rows
 
        if(rows.length===0){return res.status(404).send({msg:"No comments!!"})}
      
        return res.status(200).send({comments:rows})

    }).catch(({code})=>{
        if(code){
        next(code)}
    })
}

exports.postComment = (req,res,next) =>{
    const comment = req.body
    const articleId = req.params
    
    updateComments(comment,articleId).then(({rows})=>{
        return res.status(201).send({comment:rows})
    }).catch(({code})=>{
        if(code === undefined){return res.status(400).send({msg:"Invalid username"})}
        if(code){
            next(code)
        }
    })
}