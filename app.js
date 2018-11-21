const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect to Database
mongoose.connect(config.database, {useNewUrlParser:true});

// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database' + config.database);
})

// On Error

mongoose.connection.on('error', () => {
    console.log('atabase connection error' + config.database);
})

const app = express();

const users = require('./routes/users');

// Port Number
const port = 3000;

// Body Parser Middleware
app.use(bodyParser.json());

// CORS Middleware
app.use(cors());

// Passport Middleware

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);


// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', users);

// Index Route
app.get('/', (req,res) => {
    res.send('Invaild Endpoint');
})

// Start Server
app.listen(port, () => {
    console.log('Server starts on poart' + port)
})
 