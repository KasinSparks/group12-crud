const run = require('../../db.js');

var express = require('express');
var router = express.Router();

/* A test API endpoint */
/* http://localhost:8080/queries/monthofyear */
router.get('/', function(req, res, next) {
    res.send("API monthofyear test point. SUCCESS!");
});

router.get('/types', function(req, res, next) {
    var querystr = 
            `SELECT DISTINCT Type 
             FROM (
               (SELECT SalesID, Type
               FROM CISResidential)
               UNION 
               (SELECT SalesID, Type
               FROM CISBusiness)
              )`;

    run(querystr)
        .then(rows => {
        res.send(rows);
    });
});

/* http://localhost:8080/queries/monthofyear */
router.get('/avgsales', function(req, res, next) {
    console.log(req.query);

    var querystr = 
            `SELECT SalesDate, Count(CISRealEstateSale.SalesID), Avg(AvgTemp), Avg(SnowDepth)
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
             WHERE CISRealEstateSalesDate.SalesDate = CISWeatherSample.DateRec`;

    if (req.query["fromdate"] !== undefined) {
        querystr += " AND SalesDate >= TO_DATE('" + req.query["fromdate"] + "', 'YYYY-MM-DD')";
    }

    if (req.query["todate"] !== undefined) {
        querystr += " AND SalesDate <= TO_DATE('" + req.query["todate"] + "', 'YYYY-MM-DD')";
    }

    if (req.query["type"] !== undefined) {
        querystr += " AND Type = '" + req.query["type"] + "'";
    }

    querystr += 
            `\nGROUP BY SalesDate
             HAVING COUNT(CISRealEstateSale.SalesID) > 5 
             ORDER BY SalesDate DESC`;
    
    // Check for if the user want the query string
    /* http://localhost:8080/queries/monthofyear?showquerystr=1 */
    if (req.query["showquerystr"] !== undefined && req.query["showquerystr"] === '1') {
        res.send({ "query_str" : querystr});
    } else {
        run(querystr)
            .then(rows => {
            res.send(rows);
        });
    }
});



module.exports = router;
