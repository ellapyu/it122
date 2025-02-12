import mongoose from 'mongoose';

// For security, connectionString should be in a separate file and excluded from git
const connectionString = "mongodb+srv://<dbuser>:<dbpassword>@<cluster>.mongodb.net/test?retryWrites=true";

const connectdb = async () => {
    try {
        await mongoose.connect(connectionString, {
        dbName: 'sccprojects',
        useNewUrlParser: true,
        useUnifiedTopology: true
        });

        console.log('Mongoose connected.');

    } catch (error) {
        console.error("Connection unsuccesful:", error);
        process.exit(1);
    }
    

};

export default connectdb;