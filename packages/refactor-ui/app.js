const createError = require('http-errors');
const express = require('express');
const path = require('path');
const adaro = require('adaro');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');


module.exports = function (results) {
    var app = express();

// view engine setup
    app.engine('dust', adaro.dust());
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'dust');

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', indexRouter(results));

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

// error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    return app;
}
