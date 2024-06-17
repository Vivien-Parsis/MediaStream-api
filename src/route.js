const router = require('express').Router()
const crypto = require("node:crypto")
const { isValidEmail } = require('./check')
const { pool } = require('./pg')

router.post('/api/message/send', (request, reply) => {
    reply.header({'Access-Control-Allow-Origin':'*'})
    const email = request.body.email ? request.body.email : ""
    const message = request.body.message ? request.body.message : ""
    if(email=="" || !isValidEmail(email)){
        return reply.send('error, invalid email')
    }
    const currentdate = new Date()
    const currentdateFormated = `${currentdate.getFullYear()}-${(currentdate.getMonth()+1)<9?"0"+(currentdate.getMonth()+1):(currentdate.getMonth()+1)}-${(currentdate.getDate())<9 ? "0"+(currentdate.getDate()):(currentdate.getDate())}`
    pool.query('INSERT INTO message (email, message, date) values ($1,$2,$3)',
    [email, message, currentdateFormated],(err,res)=>{
        if(err){
            return reply.send({err})
        }
        reply.send('message send')
    })
})

router.post('/api/film/get',(request,reply)=>{
    reply.header({'Access-Control-Allow-Origin':'*','Content-type':'application/json'})
    console.log(request.body)
    const email = request.body.email ? request.body.email : ""
    const password = request.body.password ? request.body.password : ""
    if(email=="" || !isValidEmail(email)){
        return reply.send('error, invalid email')
    }
    const hashedPassword = crypto.createHash('sha256').update(password).digest("hex")
    pool.query('SELECT email, password FROM userList WHERE email=$1 AND password=$2',
    [email, hashedPassword],(err,res)=>{
        if(err){
            return reply.send({err})
        }
        if(res.rowCount==0){
            return reply.send({"message":"utilisateur introuvable"})
        }
        pool.query('SELECT id, nom, synospis, video FROM film',
        [],(err,res)=>{
            if(err){
                return reply.send({err})
            }
            reply.send(res.rows)
        })
    })
})
router.post('/api/film/search',(request,reply)=>{
    reply.header({'Access-Control-Allow-Origin':'*','Content-type':'application/json'})
    const email = request.body.email ? request.body.email : ""
    const password = request.body.password ? request.body.password : ""
    const id = request.query.id ? request.query.id : ""
    if(email=="" || !isValidEmail(email)){
        return reply.send('error, invalid email')
    }
    const hashedPassword = crypto.createHash('sha256').update(password).digest("hex")
    pool.query('SELECT email, password FROM userList WHERE email=$1 AND password=$2',
    [email, hashedPassword],(err,res)=>{
        if(err){
            return reply.send({err})
        }
        if(res.rowCount==0){
            return reply.send({"message":"utilisateur introuvable"})
        }
        pool.query('SELECT id, nom, synospis, video FROM film where id=$1',
        [id],(err,res)=>{
            if(err){
                return reply.send({err})
            }
            reply.send(res.rows[0])
        })
    })
})
router.post('/api/serie/get',(request,reply)=>{
    reply.header({'Access-Control-Allow-Origin':'*','Content-type':'application/json'})
    const email = request.body.email ? request.body.email : ""
    const password = request.body.password ? request.body.password : ""
    if(email=="" || !isValidEmail(email)){
        return reply.send('error, invalid email')
    }
    const hashedPassword = crypto.createHash('sha256').update(password).digest("hex")
    pool.query('SELECT email, password FROM userList WHERE email=$1 AND password=$2',
    [email, hashedPassword],(err,res)=>{
        if(err){
            return reply.send({err})
        }
        if(res.rowCount==0){
            return reply.send({"message":"utilisateur introuvable"})
        }
        pool.query('SELECT id, nom, synospis, video FROM serie',
        [],(err,res)=>{
            if(err){
                return reply.send({err})
            }
            reply.send(res.rows)
        })
    })
})
router.post('/api/serie/search',(request,reply)=>{
    reply.header({'Access-Control-Allow-Origin':'*','Content-type':'application/json'})
    const email = request.body.email ? request.body.email : ""
    const password = request.body.password ? request.body.password : ""
    const id = request.query.id ? request.query.id : ""
    if(email=="" || !isValidEmail(email)){
        return reply.send('error, invalid email')
    }
    const hashedPassword = crypto.createHash('sha256').update(password).digest("hex")
    pool.query('SELECT email, password FROM userList WHERE email=$1 AND password=$2',
    [email, hashedPassword],(err,res)=>{
        if(err){
            return reply.send({err})
        }
        if(res.rowCount==0){
            return reply.send({"message":"utilisateur introuvable"})
        }
        pool.query('SELECT id, nom, synospis, video FROM serie where id=$1',
        [id],(err,res)=>{
            if(err){
                return reply.send({err})
            }
            console.log(res.rows)
            reply.send(res.rows[0])
        })
    })
})
router.post('/api/login/signin',(request,reply)=>{
    reply.header({'Access-Control-Allow-Origin':'*','Content-type':'application/json'})
    const email = request.body.email ? request.body.email : ""
    const password = request.body.password ? request.body.password : ""
    if(email=="" || !isValidEmail(email)){
        return reply.send({"message":"email invalid"})
    }
    const hashedPassword = crypto.createHash('sha256').update(password).digest("hex")
    pool.query('SELECT email, password FROM userList WHERE email=$1 AND password=$2',
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
router.post('/api/login/signup',(request, reply)=>{
    const email = request.body.email ? request.body.email : ""
    const password = request.body.password ? request.body.password : ""
    if(email=="" || !isValidEmail(email)){
        return reply.send({"message":"email invalid"})
    }
    reply.header({'Access-Control-Allow-Origin':'*','Content-type':'application/json'})
    const hashedPassword = crypto.createHash('sha256').update(password).digest("hex")
    pool.query("INSERT INTO userlist(email,password) SELECT $1, $2 WHERE NOT EXISTS (SELECT email FROM userlist WHERE email = $3)",
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

module.exports = { router }