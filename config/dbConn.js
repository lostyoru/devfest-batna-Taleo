const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
    try {
        console.log(process.env.DATABASE_URI);
        await mongoose.connect(process.env.DATABASE_URI);
    } catch(err) {
        console.error(err.message);
    }
}

module.exports = connectDB;