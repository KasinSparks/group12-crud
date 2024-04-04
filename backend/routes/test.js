const run = require('../db.js');

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
    run(
        `SELECT SalesDate, Count(*), Avg(AvgTemp), Avg(SnowDepth)
         FROM CISRealEstateSale
         INNER JOIN CISRealEstateSalesDate ON CISRealEstateSale.SalesID = CISRealEstateSalesDate.SalesID
         INNER JOIN CISWeatherSample ON CISWeatherSample.DateRec = CISRealEstateSalesDate.SalesDate
         INNER JOIN 
         ((SELECT SalesID, Type
           FROM CISResidential)
           UNION 
           (SELECT SalesID, Type
           FROM CISBusiness)) e1
           ON e1.SalesID = CISRealEstateSale.SalesID
         WHERE CISRealEstateSalesDate.SalesDate = CISWeatherSample.DateRec
         GROUP BY SalesDate
         HAVING COUNT(*) > 5 
         ORDER BY SalesDate DESC`
    ).then(rows => {
        res.send(rows);
    });
});

module.exports = router;
