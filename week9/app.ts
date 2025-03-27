'use strict'
import express, { Express } from "express";
import cors from "cors";

import connectdb from './config/connectdb.js';
import addData from './populatedb.js';
import routes from './routes.js';

const app: Express = express();

app.set('port', process.env.PORT || 3000);
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded( {extended: true} )); //Parse URL-encoded bodies
app.use(express.static('./public')); // set location for static files


connectdb().then(async () => {
    console.log('Database connected.');
    await addData(); // only load if empty
});

routes(app); // passes ‘app’ instance to the routes module

// set the view engine to ejs
app.set('view engine', 'ejs');

// start server
app.listen(app.get('port'), () => {
    console.log('Express Server running at http://127.0.0.1:3000/');
  });
 