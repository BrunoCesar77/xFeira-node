module.exports = (server,knex)=> {    
    const cPrimarykey='idsale';
    const cRouter = '/report/';


server.get(cRouter+'finance_salesformpayment/show/:id',  (req, res, next) => { 
    const { id } = req.params;
   //,'Count() as qtd','sum(  ) as total'
    knex    
    .select('s.idformpayment',
            'f.descriptyon',
            knex.raw('Count(s.`idsale`) as qtd'),
            knex.raw('sum(s.`price`) as valor')
            )
 
    .from({ s: 'sales'}) 
    .innerJoin({ f: 'forms_payments'}, 'f.idformpayment', '=', 's.idformpayment')
    .where('s.idstatus',2)
    .andWhere('s.idfinance',id)
    .groupBy(1,2) 
    .then((dados)=>{
        res.send(dados);
    },next) 
    
});

   
    server.get(cRouter+'finance_salesitems/show/:id',  (req, res, next) => {     
    
       const { id } = req.params;
        
       // console.log(cwhere); 
        
        afields =[
                    'p.idgroup',
                    {group_description :'g.description'} ,                    
                    'si.idproduct',
                    {product_description :'p.description'} ,
                    {product_stock:'p.stock'} ,
                    
                    knex.raw('sum(si.qtd) as qtd'),
                    knex.raw('sum(si.`value`) as valor')
        ]
      
       // console.log(
        knex    .select(afields)
                .from({ s: 'sales'}) 
                .innerJoin({ si: 'sales_items'}, 'si.idsale', '=', 's.idsale')
                .innerJoin({ p: 'products'}, 'p.idproduct', '=', 'si.idproduct')
                .innerJoin({ g: 'groups'}, 'g.idgroup', '=', 'p.idgroup')            
                .where('s.idstatus',2)
                .andWhere('s.idfinance',id)
                .groupBy(1,2,3,4)
                .orderBy(1)
                .orderBy(5,'desc')  
               // .toSQL()); 
                .then((dados)=>{
                    res.send(dados);
                },next) 
                               
    });  

} 



