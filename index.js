require('dotenv').config()

const express = require('express');
const app = express();
const session = require('express-session');

// DB Connection
require('./configs/database')

// Set Config
require('./configs/express')(app)

// Use session
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
}));

// Set Routers
require('./router')(app)

app.listen(process.env.PORT, console.log(`Listening on port ${process.env.PORT}! Now its up to you...`));