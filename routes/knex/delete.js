const errors = require('restify-errors');

module.exports = (knex,cTableName,cPrimarykey,req,res,next) => {
    const {id} = req.params;
     
    knex(cTableName)

        .where(cPrimarykey,id)

        .delete()

        .then((dados)=>{

            if (!dados) return res.send(new errors.BadRequestError('Nenhum registro localizado para exclusão')); 

            res.send('Registro excluido com sucesso!');

        },next); 
}        
