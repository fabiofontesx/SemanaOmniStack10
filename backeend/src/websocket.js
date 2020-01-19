const socketio = require('socket.io');
const convertStringToArray = require('./utils/ConvertStringToArray');
const calculateDistance = require('./utils/calculateDistance');
let connections = [];
let io
exports.setupWebSocket = (server) =>{
   
    io = socketio(server);
   
    io.on('connection', socket =>{
        socket.on('disconnect', () =>{
            console.log('disconnect')
            connections = connections.filter(conn => conn.id != socket.id);
        });

        const {latitude, longitude, techs} = socket.handshake.query;
        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: convertStringToArray(techs)
        });
        console.log(`Tamanho após conexao ${connections.length}`);
    });

    
   
};


exports.findConnections = (coordinates, techs )=>{
    return connections.filter(connection =>{
        return calculateDistance(coordinates, connection.coordinates) < 10
            && connection.techs.some(item => techs.includes(item));
    })
}

exports.findConnections = (coordinates)=>{
    return connections.filter(connection =>{
        return calculateDistance(coordinates, connection.coordinates) < 10;
    })
}


exports.sendMessage = (to, message, data) =>{
    to.forEach(connetion => {
        io.to(connetion.id).emit(message, data);
    });
}