const express = require("express")
const cors = require("cors")
const app = express()
const dotenv = require("dotenv")
const {router} = require("./src/route")

dotenv.config()
const host = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/', router)

app.listen({ host: host, port: port }, () => {
    console.log(`This server is listen on http://${host}:${port}`);
})