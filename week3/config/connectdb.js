import mongoose from 'mongoose';

// For security, connectionString should be in a separate file and excluded from git
import dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.mongoURI;

const connectdb = async () => {
    try {
        mongoose.set('debug', true); // Enable Mongoose query debugging
        await mongoose.connect(connectionString, {
        dbName: 'sccprojects',
        useNewUrlParser: true,
        useUnifiedTopology: true
        });

        console.log('Mongoose connected.');

    } catch (error) {
        console.error("Connection unsuccesful:", error.message);
        process.exit(1);
    }
    

};

export default connectdb;