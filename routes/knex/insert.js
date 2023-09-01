const errors = require('restify-errors');

module.exports = (knex,cTableName,cPrimarykey,req,res,next) => { 
  
  knex(cTableName)
  
    .insert(req.body)
  
    .then((dados)=>{
      if (!dados) return res.send(new errors.BadRequestError('Erro ao cadastrar registro')); 
  
      res.send(dados); 
       
  
    },next);    
}