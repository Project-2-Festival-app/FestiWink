const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    author: {
        type: String,
        required: true
    },
    festival: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Festival',
        required: true
    },
    content: {
        type: String,
        required: true,
    }
}, 
{ timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;