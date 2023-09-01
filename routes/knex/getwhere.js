module.exports = function(knex,awhere,cPrimarykey) {
    
   // if (awhere == undefined) {
   //     knex.where(cPrimarykey,0);
   // }

    for (var prop in awhere) {
        const arrayprop = awhere[prop];
        const nameprop = prop;
        console.log("obj." + nameprop + " = " + arrayprop);              
        knex.andWhere(function() {
            if ( Array.isArray(arrayprop)) { 
                for (let idx = 0; idx < arrayprop.length; idx++) {
                    const obj = arrayprop[idx];                                   
                    knex.orWhere(nameprop,obj);                                                             
                } 
                   
            }

        })                       

    }    

}