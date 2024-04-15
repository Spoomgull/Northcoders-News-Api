const {selectAllTopics, readEndpoints} = require("./model.js")





exports.getTopics = (req,res,next) =>{


    selectAllTopics().then(({rows})=>{
  
  
        return res.status(200).send({topics:rows})
    })
}
exports.getEndpoints = (req,res,next)=>{

    readEndpoints().then((result)=>{

        const parsedEndpoints = JSON.parse(result)

        return res.status(200).send({endpoints:parsedEndpoints})
    })
}