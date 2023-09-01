module.exports = (server,knex)=> {

    const cTableName = 'finances'; 
    const cPrimarykey = 'idfinance'; 
    const cRouter = '/'+cTableName;

    server.post(cRouter+'/create',  (req, res, next)=> {
        require('./knex/insert')(knex,cTableName,cPrimarykey,req,res,next);      
    });


    server.get(cRouter+'/open',  (req, res, next)=> {
       
        knex(cTableName)            
            .where('idstatus',0)
            .first()
            .then((dados)=>{
                res.send(dados);
            },next);
                                       
    });
    
    
    server.get(cRouter+'/',  (req, res, next)=> {
       
        var cwhere = req.body;
        
        console.log(cwhere);     
      
       // console.log(
        knex   
            .select(cwhere.afields)

            .from({ f: cTableName}) 
           
            .where(function() {
                //if (cwhere.awhere == undefined) {
                //    this.where(cPrimarykey,'>',0);
                //}                   
                 
                for (var prop in cwhere.awhere) {
                    const arrayprop =cwhere.awhere[prop];
                    const nameprop=prop;
                    console.log("obj." + nameprop + " = " + arrayprop);              
                    this.andWhere(function() {
                        if ( Array.isArray(arrayprop)) { 
                            for (let idx = 0; idx < arrayprop.length; idx++) {
                                    const obj = arrayprop[idx];                                   
                                    this.orWhere(nameprop,obj);                                                             
                            } 
                                   
                        }

                    })                       
                }    
            
            }) 
                //.toSQL()); 
            .then((dados)=>{
                res.send(dados);
            },next)  
           
                              
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



