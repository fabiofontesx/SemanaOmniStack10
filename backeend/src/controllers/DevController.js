const Dev = require('../models/Devs');
const axios = require('axios');

module.exports = {

    async index(req, res){
        const devs = await Dev.find();
        return res.json(devs);
    },

    async store(req, res){
        const { github_username , techs, latitude, longitude } = req.body;
        const response_github = await axios.get(`https://api.github.com/users/${github_username}`);
        
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
                techs,
                location
             })
         
            return res.json(dev)
        }

        return res.json(dev)
    },

    async update(req, res){
        const { github_username, avatar_url, techs, latitude, longitude } = req.body;
        const dev = await Dev.findOneAndUpdate(
            {github_username},
            { avatar_url, techs, latitude, longitude }, 
            {new: true}
        )
        if(!dev){
            return res.status(404).json({error: 'Dev not found'});
        }
        dev.update()
        return res.json({dev});
    },

    async destroy(req, res){
        const {github_username} = req.params;
        const devId = await Dev.findOneAndDelete({github_username}, {
            projection: {_id: true}
        })
        
        if(!devId){
            return res.status(404).json({error: 'Dev not found'});
        }

        return res.json({ok: true})
    }
};