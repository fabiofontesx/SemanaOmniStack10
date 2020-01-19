import socketio from 'socket.io-client';

const socket = socketio('http://192.168.0.14:3300', {
    autoConnect: false,
    forceNew:false,
    reconnection: false
});


function subscribeToUpdateDevs(subscribeFunction){
    socket.on('dev-updated', subscribeFunction);
}

function subscribeToNewDevs(subscribeFunction){
    socket.on('new-dev', subscribeFunction);
}

function subscribeToRemoveDevs(subscribeFunction){
    socket.on('remove-dev', subscribeFunction);
}

function connect (latitude, longitude, techs) {
    socket.io.opts.query = {
        latitude,
        longitude,
        techs,
    };
    console.log('Conectando')
    socket.connect();
}

function disconnect () {
    if(socket.connected){
        socket.disconnect();
    }
}

socket.on('connect', () =>{
    console.log('conectados!')
})

socket.on('reconnect', (socket) => {
    console.log('reconectado');
});
export {
    connect,
    disconnect,
    subscribeToNewDevs,
    subscribeToRemoveDevs,
    subscribeToUpdateDevs
};