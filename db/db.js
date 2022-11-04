const mongoose = require('mongoose');
require('dotenv').config()

function connectMongoDB() {
    mongoose.connect(process.env.MONGO_URL)
    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB Successfully');
    })
    mongoose.connection.on('error', (e) => {
        console.log('An error occured while connecting to MongoDB');
        console.log(e);
    })
}

module.exports = { connectMongoDB }