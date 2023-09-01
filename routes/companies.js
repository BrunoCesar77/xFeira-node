module.exports = (server,knex)=> {

    const cTableName = 'companies'; 
    const cPrimarykey = 'idcompany'; 
    const cRouter = '/'+cTableName;

    server.post(cRouter+'/create',  (req, res, next)=> {
        require('./knex/insert')(knex,cTableName,cPrimarykey,req,res,next);      
    });
    
    server.get(cRouter+'/',  (req, res, next)=> {
        require('./knex/select')(knex,cTableName,cPrimarykey,req, res, next);       
    });
    
    server.get(cRouter+'/show/:id',  (req, res, next) => {
        require('./knex/selectwhere')(knex,cTableName,cPrimarykey,req,res,next);    
    });
  
    server.put(cRouter+'/update/:id',  (req, res, next) => {
    require('./knex/update')(knex,cTableName,cPrimarykey,req,res,next);      
    });
  
    server.del(cRouter+'/delete/:id',  (req, res, next) => {
        require('./knex/delete')(knex,cTableName,cPrimarykey,req,res,next); 
    });
} 



