var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/authenticate');
var countriesRouter = require('./routes/countries');
var imagesRouter = require('./routes/images');

var app = express();

// view engine setup
app.use(express.static(path.join(__dirname, './public')));
app.set('view engine', 'jade');

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-requested-with, authorization');
  next();
}

app.use(logger('dev'));
app.use(express.json());
app.use(allowCrossDomain);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + './public/index.html'));
});

app.use('/', indexRouter);
app.use('/authenticate', loginRouter);
app.use('/countries', countriesRouter);
app.use('/images', imagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
