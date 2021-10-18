/*
File: index.js
Author: Fabio Vitali
Version: 1.0 
Last change on: 10 April 2021


Copyright (c) 2021 by Fabio Vitali

   Permission to use, copy, modify, and/or distribute this software for any
   purpose with or without fee is hereby granted, provided that the above
   copyright notice and this permission notice appear in all copies.

   THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
   SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
   OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
   CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

*/



/* ========================== */
/*                            */
/*           SETUP            */
/*                            */
/* ========================== */
global.rootDir = __dirname;
global.startDate = null;

global.rootDir = __dirname;
global.startDate = null;

const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors');
const fs = require('fs');
var path = require('path');

//Serve per le variabili di ambiente
require('dotenv').config();


/* ========================== */
/*                            */
/*  EXPRESS CONFIG & ROUTES   */
/*                            */
/* ========================== */

let app = express();
app.use('/js', express.static(global.rootDir + '/public/js'));
app.use('/css', express.static(global.rootDir + '/public/css'));
app.use('/data', express.static(global.rootDir + '/public/data'));
app.use('/docs', express.static(global.rootDir + '/public/html'));
app.use('/img', express.static(global.rootDir + '/public/media'));
app.use(express.json());   //L'ordine di questi è importante!
app.use(cors())

const logginFolderPath = path.join(__dirname, '/log/')

var accessLogStream = fs.createWriteStream(path.join(logginFolderPath, '.log.txt'), { flags: 'a' })

const morgan = require('morgan');
app.use(
   morgan(
      '[:date[web]] :method :url :req[header] - :status',
      { stream: accessLogStream }
   )
);

// https://stackoverflow.com/questions/40459511/in-express-js-req-protocol-is-not-picking-up-https-for-my-secure-link-it-alwa
app.enable('trust proxy');

//Format console.log
require('console-stamp')(console, '[HH:MM:ss.l]');


// const objectsRouter = require(global.rootDir + '/public/routers/'); 
// app.use('/api/', Router);

const authentication = require(global.rootDir + '/public/routers/authenticationRouter');
app.use("/api/authentication/", authentication.router);

const customerRouter = require(global.rootDir + '/public/routers/customerRouter');
app.use("/api/customers/", customerRouter);

const productRouter = require(global.rootDir + '/public/routers/productRouter');
app.use("/api/products/", productRouter);

const employeeRouter = require(global.rootDir + '/public/routers/employeeRouter');
app.use("/api/employees/", employeeRouter);

const rentalRouter = require(global.rootDir + '/public/routers/rentalRouter');
app.use("/api/rentals/", rentalRouter);

const billRouter = require(global.rootDir + '/public/routers/billRouter');
app.use('/api/bills/', billRouter);

/* ========================== */
/*                            */
/*           MONGODB          */
/*                            */
/* ========================== */

const mongoCredentials = {
   user: process.env.DATABASE_USER,		//"site202120",
   pwd: process.env.DATABASE_PASSWORD,	//"quazio8U",
   site: "mongo_site202120"
}

const mongooseOptions = {
   dbName: "databaseProgettoTechWeb",
   useNewUrlParser: true,
}

//mongodb://matteo:vannucchi@localhost/databaseProgettoTechWeb
const mongouri = `mongodb://${mongoCredentials.user}:${mongoCredentials.pwd}@${process.env.DATABASE_URL}/${mongooseOptions.dbName}`;

mongoose.connect(mongouri, mongooseOptions);
mongoose.connection.on('error', (err) => console.log(err));
mongoose.connection.once('open', () => console.log("Connesso al database"));




/* ========================== */
/*                            */
/*    ACTIVATE NODE SERVER    */
/*                            */
/* ========================== */

app.listen(8000, function () {
   global.startDate = new Date();
   console.log(`App listening on port 8000 started ${global.startDate.toLocaleString()}`)
})


/*       END OF SCRIPT        */

module.exports = app;