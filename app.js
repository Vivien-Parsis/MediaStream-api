const fastify = require('fastify')({logger: true})
const path = require('node:path')
const cors = require("@fastify/cors")
const route = require("./src/route") 
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
fastify.register(require('@fastify/postgres'), {
    connectionString: postgre_url,
    ssl:true
})

route.FastifyRouter(fastify)

fastify.listen({host: host, port: port }, (err, address) => {
    if (err) throw err
    console.log(`listening to ${address}`)
})
  