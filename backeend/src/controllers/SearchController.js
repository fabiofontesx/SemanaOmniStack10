const Dev = require('../models/Devs');
const convertStringToArray = require('../utils/ConvertStringToArray');

module.exports = {
    async index(req, res){
         // Buscar todos devs num raio de 10 KM
        //Filtar por tecnologia
        const {techs, latitude, longitude} = req.query;
        const techsArray = convertStringToArray(techs);
        const devs  = await Dev.find({
            techs: {
                $in: techsArray
            },

            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000
                },
            }
        });
        return res.json({devs});

    },
}