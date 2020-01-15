const {Schema} = require('mongoose');

const PointSchema = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates:{
        //Longitude e latitude
        type: [Number],
        required:true
    }
});

module.exports = PointSchema;