module.exports = (server,knex)=> {

    const cTableName = 'finances_mov'; 
    const cPrimarykey = 'idfinancemov'; 
    const cRouter = '/'+cTableName;

    server.post(cRouter+'/create',  (req, res, next)=> {
        require('./knex/insert')(knex,cTableName,cPrimarykey,req,res,next);      
    });
    
    server.get(cRouter+'/',  (req, res, next)=> {
        require('./knex/select')(knex,cTableName,cPrimarykey,req, res, next);       
    });
    
    server.get(cRouter+'/show/:id',  (req, res, next) => {
        require('./knex/selectwhere')(knex,cTableName,'idfinance',req,res,next);    
    });

    server.get(cRouter+'/report_movs/show/:id',  (req, res, next) => {
        const { id } = req.params;
        knex(cTableName)
            .where('idfinance',id)
            .orderBy('idtype')
            .orderBy('datetimeentry')
            .then((dados)=>{
                if (!dados) return res.send(new errors.BadRequestError('Nenhum registro localizado')); 
                res.send(dados);
            },next) 
    });


  
    server.put(cRouter+'/update/:id',  (req, res, next) => {
    require('./knex/update')(knex,cTableName,cPrimarykey,req,res,next);      
    });
  
    server.del(cRouter+'/delete/:id',  (req, res, next) => {
        require('./knex/delete')(knex,cTableName,cPrimarykey,req,res,next); 
    });
} 



