module.exports = (server,knex)=> {

    const cTableName = 'sales_items'; 
    const cPrimarykey = 'idsaleitem'; 
    const cRouter = '/'+cTableName;

    server.post(cRouter+'/create',  (req, res, next)=> {
        require('./knex/insert')(knex,cTableName,cPrimarykey,req,res,next);      
    });
    
    server.get(cRouter+'/',  (req, res, next)=> {
        require('./knex/select')(knex,cTableName,cPrimarykey,req, res, next);       
    });

    server.get(cRouter+'_view/',  (req, res, next) => {     
    
       var cwhere = req.body;
        
        console.log(cwhere);     
      
       // console.log(
        knex    .select(cwhere.afields)
                .from({ si: 'sales_items'}) 
                .innerJoin({ s: 'sales'}, 's.idsale', '=', 'si.idsale')
                .innerJoin({ p: 'products'}, 'p.idproduct', '=', 'si.idproduct')
                .innerJoin({ g: 'groups'}, 'g.idgroup', '=', 'p.idgroup')
                .where(function() {
                    if (cwhere.awhere == undefined) {
                        this.where(cPrimarykey,0);
                    }
                
                    for (var prop in cwhere.awhere) {
                        const arrayprop = cwhere.awhere[prop];
                        const nameprop = prop;
                      //  console.log("obj." + nameprop + " = " + arrayprop);              
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
               // .toSQL()); 
                .then((dados)=>{
                    res.send(dados);
                },next)  
           
                        
    });
   

    server.get(cRouter+'/showp/:id',  (req, res, next) => {        
        const { id } = req.params;
        var csql = `SELECT
        si.*,
        s.IsTravel,
        CONCAT(p.description) as description,
        s.note,
        g.istoken
    FROM
        sales_items si
        INNER JOIN sales s ON ( s.idsale = si.idsale )
        INNER JOIN products p ON ( p.idproduct = si.idproduct )
        INNER JOIN \`groups\` g ON ( g.idgroup = p.idgroup ) 
    WHERE
      si.idsale=${id}`;
        knex.raw(csql)

        .then((dados)=>{
            res.send(dados[0]);
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



