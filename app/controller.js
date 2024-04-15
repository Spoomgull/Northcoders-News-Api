const {selectAllTopics} = require("./model.js")





exports.getTopics = (req,res,next) =>{


    selectAllTopics().then(({rows})=>{
  
  
        return res.status(200).send(rows)
    })
}