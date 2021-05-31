var socket = io()
const peer = new Peer()
const idSpanElement = document.querySelector('#idSpanElement')
const myVideoElement = document.querySelector('#myVideo')
const friendIdForm = document.querySelector('#friendIdForm')
const inputDataElement = document.querySelector('#inputDataElement')
const friendVideo = document.querySelector('#friendVideo')

peer.on('open', id => {
    socket.emit('peer', id)
})



;(async () => {
    let data = await window.navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })
    myVideoElement.srcObject = data
})()

socket.on('ulanish', id => {
    idSpanElement.textContent = id
})

friendIdForm.addEventListener('submit', event => {
    event.preventDefault()
    
    socket.emit('call', inputDataElement.value)
})

socket.on('error', e => alert(e))

socket.on('call', e => {
    var conn = peer.connect(e)
    conn.on('open', async () => {
        let data = await window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
            peerIdentity: true
        })
        let call = await peer.call(e, data)
        call.on('stream', remoteStream => {
            friendVideo.srcObject = remoteStream
        })
    })
})

peer.on('call', async call => {
    let data = await window.navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
        peerIdentity: true
    })
    call.answer(data)
    call.on('stream', function(remoteStream){
        friendVideo.srcObject = remoteStream
    })
})