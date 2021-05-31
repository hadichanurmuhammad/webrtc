const express = require('express')
const app = express()
const http = require('http')
const HomeRoute = require('./routes/HomeRoute')
const server = http.createServer(app)
require('dotenv').config()
const PORT = process.env.PORT
const { Server } = require('socket.io')
const path = require('path')
const { v4 } = require('uuid')

const data = []

const io = new Server(server)

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//Settings
app.set('view engine', 'ejs')
app.use('/socket', express.static(path.join(__dirname, 'node_modules', 'socket.io', 'client-dist')))
app.use('/', express.static(path.join(__dirname, "public")))
app.use('/peerjs', express.static(path.join(__dirname, 'node_modules', 'peerjs', 'dist')))



server.listen(PORT, () => console.log(`SERVER READY AT http://localhost:${PORT}`))

app.use(HomeRoute.path, HomeRoute.router)

io.on('connection', socket => {
    let user = data.find(e => e.socket_id == socket.id)

    if(!user){
        let id = v4()
        user = {
            id,
            socket_id: socket.id
        }
        data.push(user)
        socket.emit('ulanish', id)
    }

    socket.on('peer', id => {
        let userIndex = data.findIndex(e => e.socket_id == socket.id)
        data[userIndex]['peer_id'] = id
        user = data[userIndex]
    })

    socket.on('disconnect', event => {
        let d = data.findIndex(e => e.socket_id == socket.id)
        if(d > -1)
        data.splice(d, 1)
    })

    socket.on('call', id => {
        if(id == user.id){
            socket.emit('error', `Siz o'zingizga qo'ng'iroq qila olmaysiz`)
        } else if (data.findIndex(e => e.id == id) == -1) {
            socket.emit('error', `Bunday odam yo'q`)
        } else {
            let friendId = data.find(e => e.id == id)
            let user = data.find(e => e.socket_id == socket.id)
            socket.to(friendId.socket_id).emit('call', user.peer_id)
        }
    })
})