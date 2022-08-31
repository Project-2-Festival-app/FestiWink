const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const followerSchema = new mongoose.Schema({
    
})

// VIRTUALS LIKE, COMMENT AND IMAGEN




const Follower = mongoose.model('follower', followerSchema);
module.exports = Follower;