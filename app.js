const fastify = require('fastify')({logger: true});
const path = require('node:path');
const fs = require('node:fs');
const host = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`;
const port = process.env.PORT || 3000;

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
    const currentDate = new Date()
    const email = request.body.email ? request.body.email : ""
    const message = request.body.message ? request.body.message : ""
    fs.appendFile('./public/log/message.txt',`email:${email}|message:${message}|date:${new Date()}\n`, (err)=>{
        if(err){
            console.log(err)
        }
    })
    reply.send('message send')
})
fastify.get('/api/message/get', (request, reply) => {
    reply.headers({'Access-Control-Allow-Origin':'*'},{'Content-type':'text/plain'})
    reply.sendFile('log/message.txt')
})

fastify.get('/api/film/get',(request,reply)=>{
    reply.headers({'Access-Control-Allow-Origin':'*'},{'Content-type':'application/json'})
    reply.sendFile('json/film.json')
})
fastify.get('/api/serie/get',(request,reply)=>{
    reply.headers({'Access-Control-Allow-Origin':'*'},{'Content-type':'application/json'})
    reply.sendFile('json/serie.json')
})

fastify.listen({host: host, port: port }, (err, address) => {
    if (err) throw err;
    console.log(`listening to ${address}`);
})