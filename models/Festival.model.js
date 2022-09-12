const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//const NodeGeocoder = require('node-geocoder');

const CATEGORY =['Rock','Pop','Reggaeton','Indie','Techno','Electrohouse','Deep House']


const festivalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Festival name is required.'],
        minLength: [3, 'Festival name must contain at least 3 characters.'],
        unique: [true, 'Festival name must be unique'],
    },
    category: {
        type: String,
        required: [true, 'category is required.'],
        enum: CATEGORY,
    },
    location:{
        type: String,
        required: [true, 'location is required.'],
    },
    maps:{
        type: {
            type: String,
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        readableAddress: String
    },
    description:{
        type: String,
        required: [true, 'Festival description is required.'],
        minLength: [3, 'Festival description must contain at least 3 characters.'],
    },
    price:{
        type:String,
    },
    date:{
        type: Date,
        required: [true, 'Date is required.'],
    },
    image: {
        type: String,
        default: 'https://res.cloudinary.com/plasoironhack/image/upload/v1644663323/ironhack/multer-example/icono-de-li%CC%81nea-perfil-usuario-si%CC%81mbolo-empleado-avatar-web-y-disen%CC%83o-ilustracio%CC%81n-signo-aislado-en-fondo-blanco-192379539_jvh06m.jpg'
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},
{
    toObject: { virtuals: true },
  }
)

festivalSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "festival",
    justOne: false,
})
festivalSchema.virtual("like", {
    ref: "Like",
    localField: "_id",
    foreignField: "festival",
    justOne: false,
})


const Festival = mongoose.model('Festival', festivalSchema);
module.exports = Festival;