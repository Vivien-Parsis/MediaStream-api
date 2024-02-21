const fastify = require('fastify')({logger: true});
const path = require('node:path');
const fs = require('node:fs');
const cors = require("@fastify/cors")
const host = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`;
const port = process.env.PORT || 3000;
fastify.register(cors, { 
    origin:"*"
})
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

fastify.post('/api/login/signin',(request,reply)=>{
    const email = request.body.email ? request.body.email : ""
    const password = request.body.password ? request.body.password : ""
    reply.headers({'Access-Control-Allow-Origin':'*'},{'Content-type':'application/json'})
    const users = require("./user.json")
    for(let user of users){
        if(user.email==email && user.password==password){
            reply.send(user);
            return;
        }
    }
    reply.send({"message":"erreur"})
})
fastify.post('/api/login/signup',(request, reply)=>{
    const email = request.body.email ? request.body.email : ""
    const password = request.body.password ? request.body.password : ""
    reply.headers({'Access-Control-Allow-Origin':'*'},{'Content-type':'application/json'})
    if(email.trim()=="" || password.trim()==""){
        reply.send({"message":"erreur"})
        return
    }
    const users = require("./user.json")
    for(let user of users){
        if(user.email==email && user.password==password){
            reply.send({"message":"user already exist"});
            return;
        }
    }
    users.push({"email":email,"password":password})
    fs.writeFile("./user.json",JSON.stringify(users),(err)=>{
        if(err){
            console.log(err)
        }else{
            console.log("successfull signup")
        }
    })
    reply.send({"message":"successfully sign up"})
})

fastify.listen({host: host, port: port }, (err, address) => {
    if (err) throw err;
    console.log(`listening to ${address}`);
})
