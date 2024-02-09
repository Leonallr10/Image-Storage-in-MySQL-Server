const express = require('express');
const routes = require('./routes/index'); // Ensure correct path to routes
const http = require('http');
const path = require('path');
const busboy = require("then-busboy");
const fileUpload = require('express-fileupload');
const app = express();
const mysql = require('mysql');
const bodyParser = require("body-parser");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

connection.connect();

global.db = connection;

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views')); // Use path.join for cross-platform compatibility
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

// Routes
app.get('/', routes.index);
app.post('/', routes.index);
app.get('/profile/:id', routes.profile);

// Start server
const server = http.createServer(app);
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
