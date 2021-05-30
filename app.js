const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
require('dotenv').config()
const PORT = process.env.PORT

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Settings
app.set('view engine', 'ejs')



server.listen(PORT, () => console.log(`SERVER READY AT http://localhost:${PORT}`))