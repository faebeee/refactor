var express = require('express');
var router = express.Router();

module.exports = (resultFile) => {
    /* GET home page. */
    router.get('/', function (req, res, next) {
        const results = require(resultFile);
        res.render('index', {
            file: resultFile,
            results,
        });
    });

    return router;
}
