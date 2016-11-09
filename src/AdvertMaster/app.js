var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var Util = require('./lib/myutil.js');
var log4js = Util.log4js;
var log = log4js.getLogger('normal');
log.setLevel('INFO');

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');

var app = express();
app.use(log4js.connectLogger(log,{level:'auto',format:':method:url'}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger(':method /:status :response-time :remote-addr '));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:"12liu555"}));
app.use(express.static(path.join(__dirname, '/public')));

/*Route
* */
app.use('/', routes);
app.use('/users', users);
app.use('/login',login);
app.use('/wzzbmp',require("./routes/wzzbmp"));
app.use('/signup',require("./routes/signup"));
app.use('/register',require("./routes/register"));
/*Post Interface
* */
app.use('/getWebSiteInfo',require("./routes/interface/getWebSiteInfo"));
app.use('/wzzbmp/getWebSiteInfo',require("./routes/interface/getWebSiteInfo"));
app.use('/statFlow',require("./routes/interface/statFlow"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
