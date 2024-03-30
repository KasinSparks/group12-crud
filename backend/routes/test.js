const run = require('../testdb.js');

var express = require('express');
var router = express.Router();

/* A test API endpoint */
/* http://localhost:8080/test */
router.get('/', function(req, res, next) {
    res.send("API test point. SUCCESS!");
});

/* A test API endpoint */
/* http://localhost:8080/test/2 */
router.get('/2', function(req, res, next) {
    res.send("API test point 2. SUCCESS!");
});

/* A test API endpoint */
/* http://localhost:8080/test/query_test */
router.get('/query_test', function(req, res, next) {
    run().then(rows => {
        res.send(rows);
    });
});

module.exports = router;
