const express = require("express");
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cors = require('cors');
const csurf = require('csurf');
const { isProduction } = require('./config/keys');

const usersRouter = require('./routes/api/users'); 
const echosRouter = require('./routes/api/echos');
const csrfRouter = require('./routes/api/csrf');

const app = express();

app.use(logger('dev')); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser()); 

if (!isProduction) {
    app.use(cors());
}

app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

app.use('/api/users', usersRouter); 
app.use('/api/echos', echosRouter);
app.use('/api/csrf', csrfRouter);


module.exports = app;

