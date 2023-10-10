const  cfg =
{
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    database : 'myourdb',
    user : 'root',
    password : '1234'
  }
}
//ALTER USER 'root'@'localhost' IDENTIFIED BY '1234'; 
//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
module.exports =  cfg;
  
 
