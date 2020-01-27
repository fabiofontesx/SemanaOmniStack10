const Dev = require('../models/Devs');
const axios = require('axios');
const convertStringToArray = require('../utils/ConvertStringToArray');
const {sendMessage, findConnections, findConnectionsInTenKM } = require('../websocket');

module.exports = {

    async index(req, res){
        const devs = await Dev.find();
        return res.json(devs);
    },

    async store(req, res){
        const { github_username , techs, latitude, longitude } = req.body;
        const response_github = await axios.get(`https://api.github.com/users/${github_username}`);
        
        const techsArray = convertStringToArray(techs);
        let dev = await Dev.findOne({github_username});
        if(!dev){

                  //Caso o name nao exista recebe o login
            const { name = login, avatar_url, bio } = response_github.data;
             /** if(!name){
                 name = response_github.data.login;
             } */

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
         
            dev  = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
             })
             
            //Filtrar as conexões que estão há no maximo 10km de distancia
            //E que o novo dev tenha pelo menos uma das tecnologias filtradas
            
            const sendSocketMessageTo = findConnections(
                {latitude, longitude},
                techsArray
            );
            
            console.log(dev);
            console.log(`Enviando novo dev para ${sendSocketMessageTo.length} sockets abertos`);
            sendMessage(sendSocketMessageTo, 'new-dev', dev);

            return res.json(dev)
        }

        return res.json(dev)
    },

    async update(req, res){
        const { github_username, techs, latitude, longitude } = req.body;
        const techsArray = convertStringToArray(techs);
        const dev = await Dev.findOneAndUpdate(
            {github_username},
            { techs:techsArray, latitude, longitude }, 
            {new: true}
        )
        if(!dev){
            return res.status(404).json({errorç: 'Dev not found'});
        }

        dev.update()
        return res.json({dev});
    },

    async destroy(req, res){
        const {github_username} = req.params;
        const devDeleted = await Dev.findOneAndDelete({github_username})
        
        if(!devDeleted){
            return res.status(404).json({error: 'Dev not found'});
        }

        const {_id, location} = devDeleted;
        const {coordinates} = location;

        longitude = coordinates[0];
        latitude = coordinates[1];

        const connections = findConnectionsInTenKM({latitude, longitude});
        console.log("Enviando delete para conexoes");
        console.log(connections);
        sendMessage(connections, 'remove-dev', _id);

        return res.json({ok: true})
    }
};