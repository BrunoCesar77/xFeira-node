module.exports = (server,knex)=> {

    const cTableName = 'sales'; 
    const cPrimarykey = 'idsale'; 
    const cRouter = '/'+cTableName;

    server.post(cRouter+'/create',  (req, res, next)=> {
        require('./knex/insert')(knex,cTableName,cPrimarykey,req,res,next);      
    });


    server.post(cRouter+'/invoicee/:id',  (req, res, next)=> {      
        
        require('./knex/insert')(knex,cTableName,cPrimarykey,req,res,next);      
    });

    server.post(cRouter+'/invoice/:id',  (req, res, next)=> {        
        
        const {id} = req.params;  
        var idresult = 0;     
        var PasswordKey = 0 ;     
        var sSql = [];  
        const typeprint = { tpNone : 0, 
                            tpProductsProduction : 1, 
                            tpPassWord : 2,
                            tpImpFinanceSalesItems:  3,
                            tpImpProductsBalance: 4,
                            tpImpProductsInOut:   5,
                            tpImpProductsProduction:  6,
                            tpOpenDrawer:7
                        };      

        var cfg = { GetGen_PasswordKey :  () => {                                        
                        return new Promise((resolve,reject) => {                           
                            knex('gen_password')
                            .insert( {code: 0})                         
                            .then(  
                                (resp)=>{ 
                                    resolve(resp[0])
                               }                                                                              
                            );
                                                                                   
                        })                      
                    }
                    ,
                    GetIstoken :  () => {
                        return new Promise((resolve,reject) => {                      
                            knex 
                            .select(                      
                                    knex.raw('sum(1) AS qtd')                                                                                                
                                   )
                            .from({ si: 'sales_items'})                         
                            .innerJoin({ p: 'products'}, 'p.idproduct', '=', 'si.idproduct') 
                            .innerJoin({ g: 'groups'}, 'g.idgroup', '=', 'p.idgroup') 
                        
                            .where('si.idsale',id)
                            .andWhere('g.istoken','=',0)
                            .andWhere('p.idprinter','>',0)                       
                     
                            .then((resp)=>{ 
                                resolve(resp)   
                            }) 
                        }) 
                    } 
                    ,               

                    SetPrintres_QueueItem :  (item) => {
                        return new Promise((resolve,reject) => {  
                            sSql =  [{   
                                idprinter : item.idprinter, 
                                idkeys : item.idkeys.toString(), 
                                password : PasswordKey,
                                idtypeprint : typeprint.tpProductsProduction
                            }];

                           // console.log(sSql);
                
                            knex('printers_queue')
                            .insert(sSql)
                            .then((resp)=>{ 
                                resolve(resp)   
                            }) 
                        }) 
                    }
                    ,
                    SetPrintres_Queue :  (aidprinter,aidkeys,aPasswordKey,aidtypeprint) => {
                
                        sSql =  [{   
                            idprinter : aidprinter, 
                            idkeys : aidkeys, 
                            password : aPasswordKey,
                            idtypeprint : aidtypeprint 
                        }];
                      //  console.log( sSql );
                        knex('printers_queue')
                        .insert(sSql)
                        .then((resp)=>{ 
                            
                         }) 
                    }
                    ,

                    SetSaleInvoice :  (aid) => {
                        return new Promise((resolve,reject) => {               
                            knex(cTableName)
                                .where(cPrimarykey,aid)
                                .update({idstatus : 2})
                                .then((resp)=>{ 
                                    resolve(aid)                                   
                                }) 
                        })                                                       
                           
                    }                     
                 
                }

            knex 
                .select(                   
                        knex.raw('if(p.idprinter>0, p.idprinter ,u.idprintermain) AS idprinter'),  
                        knex.raw('if(g.istoken=0, 0 ,si.idsaleitem) AS Respistoken'), 
                        knex.raw('if(g.istoken=0, 1 ,si.qtd) AS Respqtd'), 
                        knex.raw('MAX(u.idprintermain) as idprintermain'),
                        knex.raw('GROUP_CONCAT(si.idsaleitem) as idkeys')                                                                   
                       )
                .from({ si: 'sales_items'}) 
            
                .innerJoin({ p: 'products'}, 'p.idproduct', '=', 'si.idproduct') 
                .innerJoin({ g: 'groups'}, 'g.idgroup', '=', 'p.idgroup') 
                .innerJoin({ s: 'sales'}, 's.idsale', '=', 'si.idsale')
                .leftJoin({ u: 'users'}, 'u.iduser', '=', 's.iduser')  
                .where('si.idsale',id)
            
                //.where('p.idprinter','>',0)
            
                .groupBy('idprinter')
                .groupBy('Respistoken')
                .groupBy('Respqtd')
                
            
            .then(async (dados)=>{ 
                //console.log(dados);              
                if (dados.length>0) {  
                    var Lidprintermain = dados[0].idprintermain;
                    if (Lidprintermain<0) {
                        Lidprintermain=1;
                    }
                    console.log(Lidprintermain); 
                    PasswordKey = await cfg.GetGen_PasswordKey();
                    //console.log(PasswordKey);

                    cfg.SetPrintres_Queue(Lidprintermain,undefined,PasswordKey,typeprint.tpOpenDrawer);//Abrir Gaveta               

                    Istoken = await cfg.GetIstoken(); 
                   // console.log(Istoken[0]);
                    if (Istoken[0].qtd>0) {                      
                        cfg.SetPrintres_Queue(Lidprintermain,id,PasswordKey,typeprint.tpPassWord);
                    }
                    

                    for (index = 0; index < dados.length; index++) {                    
                        const item = dados[index];                     
                            idresult = await cfg.SetPrintres_QueueItem(item); 
                                         
                            for (Count = 1; Count < item.Respqtd; Count++) {                                                                                
                                idresult = await cfg.SetPrintres_QueueItem(item); 
                            }                       
                   
                                                                                                                         
                    }

                }   

                idresult = await cfg.SetSaleInvoice(id);         
                res.send([idresult]);

            },next)   
    });
    
    server.get(cRouter+'/',  (req, res, next)=> {
     
        var cwhere = req.body;

        if (cwhere == undefined) {
            cwhere = { afields: [ "s.*" ], awhere: { idsale: [ 0 ]} }
        }
      //  console.log(cwhere);     
      
        knex    .select(cwhere.afields)
                .from({ s: 'sales'})
                .where(function() {
                    if (cwhere.awhere == undefined) {
                        this.where(cPrimarykey,0);
                    }
             
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
                //.limit(10).offset(30)
                .orderBy(cPrimarykey ,'desc')

                .then((dados)=>{
                    res.send(dados);
                },next)  
           
                        
    });

    

    
 server.get(cRouter+'/showw',  (req, res, next) => {
    knex 
    .select(                     
            'p.idprinter',  
            knex.raw('if(g.istoken=0, 0 ,si.idsaleitem) AS Respistoken'), 
            knex.raw('if(g.istoken=0, 1 ,si.qtd) AS qtd'), 
            knex.raw('GROUP_CONCAT(si.idsaleitem) as idkeys')                                                                 
           )
    .from({ si: 'sales_items'}) 

    .innerJoin({ p: 'products'}, 'p.idproduct', '=', 'si.idproduct') 
    .innerJoin({ g: 'groups'}, 'g.idgroup', '=', 'p.idgroup') 

    .where('si.idsale',1000)

    .where('p.idprinter','>',0)

    .groupBy('p.idprinter')
    .groupBy('Respistoken')
   
    .then(async (dados)=>{             
             
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



