import socketio from 'socket.io-client';

const socket = socketio('http://192.168.0.26:3300', {
    autoConnect: false,
    forceNew:false,
    reconnection: false
});


function subscribeToNewDevs(subscribeFunction){
    socket.on('new-dev', subscribeFunction);
}

function subscribeToRemoveDevs(subscribeFunction){
    socket.on('remove-dev', subscribeFunction);
}

async function connect (latitude, longitude, techs) {
    socket.io.opts.query = {
        latitude,
        longitude,
        techs,
    };
    await socket.connect();
}

async function disconnect () {
    if(socket.connected){
        await socket.disconnect();
    }
}

socket.on('connect', () =>{
    console.log('Socket Conectado!')
})

socket.on('reconnect', (socket) => {
    console.log('Socket reconectado');
});

export {
    connect,
    disconnect,
    subscribeToNewDevs,
    subscribeToRemoveDevs,
    subscribeToUpdateDevs
};