const check = require("./check")
const crypto = require("node:crypto")

const FastifyRouter = (fastify) => {
    fastify.post('/api/message/send', (request, reply) => {
        reply.headers({'Access-Control-Allow-Origin':'*'})
        const email = request.body.email ? request.body.email : ""
        const message = request.body.message ? request.body.message : ""
        if(email=="" || !check.isValidEmail(email)){
            return reply.send('error, invalid email')
        }
        const currentdate = new Date()
        const currentdateFormated = `${currentdate.getFullYear()}-${(currentdate.getMonth()+1)<9?"0"+(currentdate.getMonth()+1):(currentdate.getMonth()+1)}-${(currentdate.getDate())<9 ? "0"+(currentdate.getDate()):(currentdate.getDate())}`
        fastify.pg.query('INSERT INTO message (email, message, date) values ($1,$2,$3)',
        [email, message, currentdateFormated],(err,res)=>{
            if(err){
                return reply.send({err})
            }
            reply.send('message send')
        })
    })
    
    fastify.get('/api/film/get',(request,reply)=>{
        reply.headers({'Access-Control-Allow-Origin':'*'},{'Content-type':'application/json'})
        fastify.pg.query('SELECT id, nom, synospis, video FROM film',
        [],(err,res)=>{
            if(err){
                return reply.send({err})
            }
            reply.send(res.rows)
        })
    })
    fastify.get('/api/serie/get',(request,reply)=>{
        reply.headers({'Access-Control-Allow-Origin':'*'},{'Content-type':'application/json'})
        fastify.pg.query('SELECT id, nom, synospis, video FROM serie',
        [],(err,res)=>{
            if(err){
                return reply.send({err})
            }
            reply.send(res.rows)
        })
    })
    
    fastify.post('/api/login/signin',(request,reply)=>{
        reply.headers({'Access-Control-Allow-Origin':'*'},{'Content-type':'application/json'})
        const email = request.body.email ? request.body.email : ""
        const password = request.body.password ? request.body.password : ""
        if(email=="" || !check.isValidEmail(email)){
            return reply.send({"message":"email invalid"})
        }
        const hashedPassword = crypto.createHash('sha256').update(password).digest("hex")
        fastify.pg.query('SELECT email, password FROM userList WHERE email=$1 AND password=$2',
        [email, hashedPassword],(err,res)=>{
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
        if(email=="" || !check.isValidEmail(email)){
            return reply.send({"message":"email invalid"})
        }
        reply.headers({'Access-Control-Allow-Origin':'*'},{'Content-type':'application/json'})
        const hashedPassword = crypto.createHash('sha256').update(password).digest("hex")
        fastify.pg.query("INSERT INTO userlist(email,password) SELECT $1, $2 WHERE NOT EXISTS (SELECT email FROM userlist WHERE email = $3)",
        [email, hashedPassword, email],(err,res)=>{
            if(err){
                return reply.send({err})
            }
            if(res.rowCount==1){
                reply.send({"message":"successfully sign up"})
            }else{
                reply.send({"message":"already exits"})
            }
        })
    })
}

module.exports = { FastifyRouter }