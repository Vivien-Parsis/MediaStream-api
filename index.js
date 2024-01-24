const fastify = require('fastify')({logger: true});
const path = require('node:path');
const fs = require('node:fs');

fastify.register(require('@fastify/static'),{ 
    root: path.join(__dirname)+"/public",
    prefix: '/',
    decorateReply: true
})
fastify.get('/', (request, reply)=>{
    reply.send('')
})
fastify.post('/api/message/send', (request, reply) => {
    reply.headers({'Access-Control-Allow-Origin':'*'})
    const email = request.body.email ? request.body.email : ""
    const message = request.body.message ? request.body.message : ""
    fs.appendFile('./log/message.log',`email:${email}|message:${message}\n`, (err)=>{
        if(err){
            console.log(err)
        }
    })
    reply.send('message send')
})

fastify.get('/api/film/get',(request,reply)=>{
    reply.headers({'Access-Control-Allow-Origin':'*'},{'Content-type':'application/json'})
    reply.sendFile('json/film.json')
})
fastify.get('/api/serie/get',(request,reply)=>{
    reply.headers({'Access-Control-Allow-Origin':'*'},{'Content-type':'application/json'})
    reply.sendFile('json/serie.json')
})

fastify.listen({ port : 3001 }, (err, address) => {
    if (err) throw err;
    console.log(`listening to ${address}`);
})