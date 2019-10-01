const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// store config variables in dotenv
require('dotenv').config();
const cors = require('cors');
let userRoute = require('./routes/user_route');
let skillRoute = require('./routes/skill_route');
let abilityRoute = require('./routes/ability_route');
let tagRoute = require('./routes/tag_route');

// ****** allow cross-origin requests code START ****** //
app.use(cors()); // uncomment this to enable all CORS and delete cors(corsOptions) in below code
var corsMiddleware = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //replace localhost with actual host
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
    next();
}
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(corsMiddleware);
// ****** allow cross-origin requests code END ****** //
// ****** routes START ****** //
app.use('/user', userRoute);
app.use('/skill', skillRoute);
app.use('/ability', abilityRoute);
app.use('/tag', tagRoute);
// ****** routes END ****** //

app.use('/', (req, res) => res.send("Welcome GPS Mobile Tracker App User !"));
app.listen(process.env.PORT, () => console.log('Elish Enterprise Server is ready on localhost:' + process.env.PORT));
