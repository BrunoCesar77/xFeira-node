module.exports = (server,knex)=> {
    const cRouter = '/qryall/';
    server.get(cRouter,  (req, res, next)=> {     
        var cSql = req.body;

        if (cSql.sql == undefined) {
            cSql.sql= 'select * from sales';
        }
       // console.log(cSql);     
  
        knex    .raw(cSql.sql)

            .then((dados)=>{
                res.send(dados);
            },next)  
       
                    
    });
};