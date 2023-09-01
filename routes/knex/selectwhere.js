const errors = require('restify-errors');

module.exports = (knex,cTableName,cPrimarykey,req,res,next) => {
    const { id } = req.params;
    knex(cTableName)

        .where(cPrimarykey,id)

        .first()

        .then((dados)=>{

            if (!dados) return res.send(new errors.BadRequestError('Nenhum registro localizado')); 

            res.send(dados);

        },next)
}