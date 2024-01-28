const express = require("express");
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const usersRouter = require('./routes/api/users'); 
const echosRouter = require('./routes/api/echos');

const app = express();

app.use(logger('dev')); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser()); 

app.use('/api/users', usersRouter); 
app.use('/api/echos', echosRouter);

module.exports = app;

