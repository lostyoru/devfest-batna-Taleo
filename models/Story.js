const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = {
    title: String,
    body: String,
    image: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}

module.exports = mongoose.model('Story', StorySchema);