module.exports = (server,knex)=> {

    const cTableName = 'printers_queue'; 
    const cPrimarykey = 'idprinterqueue'; 
    const cRouter = '/'+cTableName;

    server.post(cRouter+'/create',  (req, res, next)=> {
        require('./knex/insert')(knex,cTableName,cPrimarykey,req,res,next);      
    });

    server.post(cRouter+'/resetpassword',  (req, res, next)=> {
        knex('gen_password')
            .where('idpassword','>',0)
            .del()
            .then((dados)=>{ 
                knex.raw('ALTER TABLE `gen_password` AUTO_INCREMENT = 0')
                .then(function(resp) { 
                    res.send(resp);   
                })  
            },next);       
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

    server.get(cRouter+'/products/:id',  (req, res, next) => {
        require('./knex/selectwhere')(knex,cTableName,cPrimarykey,req,res,next);    
    });
} 
