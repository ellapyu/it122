import mongoose from 'mongoose';

// For security, connectionString should be in a separate file and excluded from git
const connectionString = "mongodb+srv://epyu:dFnEIQOvr4w0CBjj@sccprojects.w8iof.mongodb.net/?retryWrites=true&w=majority&appName=sccprojects";


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