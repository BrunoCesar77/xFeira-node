module.exports = (server,knex) => {
    require('./products')(server,knex);  
    require('./products_stock_mov')(server,knex); 

    require('./productions')(server,knex);  
    require('./productions_items')(server,knex);  

    require('./users')(server,knex);  
    require('./companies')(server,knex);
    require('./printers')(server,knex);
    require('./groups')(server,knex);
    require('./printres_queue')(server,knex);
    require('./sales')(server,knex);  
    require('./sales_items')(server,knex); 
    require('./report')(server,knex);   
    require('./finances')(server,knex);     
    require('./finances_mov')(server,knex); 

    require('./config')(server,knex); 
    
    require('./backup')(server,knex); 
    require('./knex/qryall')(server,knex); 

    
}