module.exports = (server,knex)=> {

    const cTableName = 'products_stock_mov'; 
    const cPrimarykey = 'idproductstockmov'; 
    const cRouter = '/'+cTableName;

    server.post(cRouter+'/create',  (req, res, next)=> {
        require('./knex/insert')(knex,cTableName,cPrimarykey,req,res,next);      
    }); 

  
    server.get(cRouter+'/',  (req, res, next)=> {
      require('./knex/select')(knex,  cTableName,cPrimarykey,req, res, next);       
    });
    
    server.get(cRouter+'/show/:id',  (req, res, next) => {
        require('./knex/selectwhere')(knex,cTableName,cPrimarykey,req,res,next);    
    });

    server.get(cRouter+'_view/show/:id',  (req, res, next)=> {
        const { id } = req.params;
        knex    .select('ps.idproduct','p.description','ps.qtd','p.stock')
                .from({ ps: cTableName}) 
                .innerJoin({ p: 'products'}, 'p.idproduct', '=', 'ps.idproduct')
                .where('ps.refprint',id)
                .andWhere('ps.datetimeentry','>=', 'CURRENT_DATE-5')
                .then((dados)=>{
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



