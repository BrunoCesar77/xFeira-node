
module.exports = (server)=> {
    
    server.post('/backup',  (req, res, next)=> {
        const lmysqldump = require('mysqldump');
        function formatarData(){
            var data = new Date(),
                dia  = data.getDate().toString(),
                diaF = (dia.length == 1) ? '0'+dia : dia,
                mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
                mesF = (mes.length == 1) ? '0'+mes : mes,
                anoF = data.getFullYear(),

                hora = data.getHours(),
                hora = (hora.length == 1) ? '0'+hora : hora,
                min = data.getMinutes(),
                min = (min.length == 1) ? '0'+min : min;
            return anoF+mesF+diaF+'_'+hora+min;
        }
         
        const cfg = require('./knex/connection');
        lmysqldump ({
            connection: {
                host : '127.0.0.1',
                database : 'myourdb',
                user : 'root',
                password : '1234'  
        },
        compressFile: true,
        dumpToFile: './Backup/'+formatarData()+'dump.sql.gz'
        });
  
    res.send([1]);
    
  });
} 
  