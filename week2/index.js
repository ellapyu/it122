'use strict'
import express from 'express';

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static('./public')); // set location for static files
app.use(express.urlencoded()); //Parse URL-encoded bodies

import routes from './routes.js';
routes(app); // passes ‘app’ instance to the routes module

// set the view engine to ejs
app.set('view engine', 'ejs');

// start server
app.listen(app.get('port'), () => {
    console.log('Express Server running at http://127.0.0.1:3000/');
  });



