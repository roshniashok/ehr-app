var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
//var passport = require('passport');

var libs = process.cwd() + '/libs/';
//require(libs + 'auth/auth');

var config = require('./config');
var log = require('./log')(module);
//var oauth2 = require('./auth/oauth2');

var ledger = require('./routes/ledger')
var doctor = require('./routes/doctor')
var patient = require('./routes/patient')
var technician = require('./routes/technician')
var pharmacist = require('./routes/pharmacist')
var paramedic = require('./routes/paramedic')
var insuranceProvider = require('./routes/insuranceProvider')
var insuranceNotes = require('./routes/insuranceNotes')
var prescriptionNote = require('./routes/prescriptionNote')
var record = require('./routes/record')
var labReport = require('./routes/labReport')

//var users = require('./routes/users');
//var articles = require('./routes/articles');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(passport.initialize());


app.use('/ledger', ledger)
app.use('/doctor', doctor)
app.use('/patient', patient)
app.use('/technician', technician)
app.use('/pharmacist', pharmacist)
app.use('/paramedic', paramedic)
app.use('/insuranceProvider', insuranceProvider)
app.use('/insuranceNotes', insuranceNotes)
app.use('/prescriptionNote', prescriptionNote)
app.use('/record', record)
app.use('/labReport', labReport)



//app.use('/api/users', users);
//app.use('/api/articles', articles);
//app.use('/api/oauth/token', oauth2.token);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({
        error: 'Not found'
    });
    return;
});

// Error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    res.json({
        error: err.message
    });
    return;
});

module.exports = app;
