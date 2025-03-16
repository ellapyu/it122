import mongoose from 'mongoose';

// For security, connectionString should be in a separate file and excluded from git
require('dotenv').config()
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;
const connectionString = new MongoClient(uri);


const connectdb = async () => {
    try {
        mongoose.set('debug', true); // Enable Mongoose query debugging
        await mongoose.connect(connectionString, {
        dbName: 'sccprojects',
        });

        console.log('Mongoose connected.');

    } catch (error) {
        console.error("Connection unsuccesful:", error.message);
        process.exit(1);
    }
    

};

export default connectdb;