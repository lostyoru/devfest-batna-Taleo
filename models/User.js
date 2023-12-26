const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type:String,
        default: 'https://res.cloudinary.com/dekmr7qlp/image/upload/v1701910051/default-pfp_uc7yn8.jpg'
    },
    stories: [{
        type: Schema.Types.ObjectId,
        ref: 'Story'
    }],
    roles: {
        User:{
            type: Number,
            default: 2005
        },
        Admin: Number,
    },
    refreshToken: {
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema);