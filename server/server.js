const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    auth = require('./routes/auth'),
    api = require('./routes/api'),
    favicon = require('serve-favicon');
    
require('dotenv').config();
const port = process.env.PORT;

const app = express();

app.disable('x-powered-by'); // remove x-powered-by header

app.use(express.static(__dirname + '/public'))

app.use(cors()); // Enabling CORS

app.use(bodyParser.urlencoded({extended: true})); // parse url encoded requests
app.use(bodyParser.json()); // parse json encoded requests

// app.get('/Error', function(req, res, next){
//     next(new Error('Random error!'));
// });

app.use('/api', api);
app.use('/authenticate', auth);
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use((req, res, next) => {
    res.status(404);
    console.log(`Not found url: ${req.url}`)
    res.send({ error: 'Not found'});
    return;
});

// Error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    console.log(`Internal error ${res.statusCode}: ${err.message}`);
    res.send({ error: err.message});
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
