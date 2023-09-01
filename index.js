const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware2')
 
const server = restify.createServer({
  name: 'X-Pastel',
  version: '1.0.0'
});

const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['*'],
  allowHeaders: ['Content-type']
})

server.use(cors.preflight)
server.use(cors.actual)

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.authorizationParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({requestBodyOnGet: true},{params:true}));


const knex = require('./routes/knex/knexcx');
server.listen(8082, () => {  
  require('./routes/index')(server,knex);
  console.log('%s listening at %s', server.name, server.url);
});











