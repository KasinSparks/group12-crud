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

module.exports = router;
