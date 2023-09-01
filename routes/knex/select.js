module.exports = (knex,cTableName,cPrimarykey,req,res,next) => {   
    knex(cTableName)
    .then((dados)=>{   
        res.send(dados);
    },next)
}