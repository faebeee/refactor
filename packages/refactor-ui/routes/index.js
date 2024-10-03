var express = require('express');
var router = express.Router();

module.exports = (results) => {
    /* GET home page. */
    router.get('/', function (req, res, next) {
        res.render('index', {
            results,
        });
    });

    return router;
}
