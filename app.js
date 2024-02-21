const fastify = require('fastify')({logger: true})
const path = require('node:path')
const fs = require('node:fs')
const cors = require("@fastify/cors")
fastify.register(cors, { 
    origin:"*"
})
fastify.register(require('@fastify/static'),{ 
    root: path.join(__dirname)+"/public",
    prefix: '/',
    decorateReply: true
})
const dotenv = require("dotenv")
dotenv.config()

const host = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`

const port = process.env.PORT || 3000
const postgre_url = process.env.POSTGRE_URL || ""
console.log(postgre_url)
fastify.register(require('@fastify/postgres'), {
    connectionString: postgre_url,
    ssl:true
})
fastify.get('/', (request, reply)=>{
    reply.send('')
})
fastify.get('/pg',(request, reply)=>{
    
    reply.send("")
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
    reply.headers({'Access-Control-Allow-Origin':'*'},{'Content-type':'application/json'})
    const email = request.body.email ? request.body.email : ""
    const password = request.body.password ? request.body.password : ""
    fastify.pg.query('SELECT FROM userList WHERE email=$1 AND password=$2',
    [email, password],(err,res)=>{
        if(err){
            return reply.send({err})
        }
        if(res.rowCount==0){
            return reply.send({"message":"utilisateur introuvable"})
        }
        reply.send({email:email,password:password})
    })
})
fastify.post('/api/login/signup',(request, reply)=>{
    const email = request.body.email ? request.body.email : ""
    const password = request.body.password ? request.body.password : ""
    reply.headers({'Access-Control-Allow-Origin':'*'},{'Content-type':'application/json'})
    fastify.pg.query('SELECT FROM userList WHERE email=$1 AND password=$2',
    [email, password],(err,res)=>{
        if(err){
            return reply.send({err})
        }
        if(res.rowCount==1){
            return reply.send({"message":"utilisateur existe deja"})
        }
        reply.send({"message":"successfully sign up"})
    })
})

fastify.listen({host: host, port: port }, (err, address) => {
    if (err) throw err
    console.log(`listening to ${address}`)
})