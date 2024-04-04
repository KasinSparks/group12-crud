const run = require('../../db.js');

var express = require('express');
var router = express.Router();

/* A test API endpoint */
/* http://localhost:8080/queries/monthofyear */
router.get('/', function(req, res, next) {
    res.send("API monthofyear test point. SUCCESS!");
});

/* http://localhost:8080/queries/monthofyear/types*/
// Sends an array of the different types of Real Estate properties
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

/* http://localhost:8080/queries/monthofyear/avgsales */
// NOTE: Do NOT use a production environment. Does not defend against SQL
//       injection attacks. 
router.get('/avgsales', function(req, res, next) {
    //console.log(req.query);
    
    // The dynamic query string
    var querystr = 
            `SELECT SalesDate, Count(CISRealEstateSale.SalesID), AVG(SoldValue), Avg(AvgTemp), Avg(SnowDepth), Avg(Precipitation)
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
    
    // If there is a start date, add it to the where clause
    if (req.query["fromdate"] !== undefined) {
        querystr += " AND SalesDate >= TO_DATE('" + req.query["fromdate"] + "', 'YYYY-MM-DD')";
    }

    // If there is an end date, add it to the where clause
    if (req.query["todate"] !== undefined) {
        querystr += " AND SalesDate <= TO_DATE('" + req.query["todate"] + "', 'YYYY-MM-DD')";
    }

    // If there is a property type specified, add it to the where clause
    if (req.query["type"] !== undefined) {
        querystr += " AND Type = '" + req.query["type"] + "'";
    }

    querystr += `\nGROUP BY SalesDate`;

    // If there is a minumum or maximum value for a given column specified, add it to the having clause
    if ((req.query["minval"] !== undefined || req.query["maxval"] !== undefined) && req.query["column"] !== undefined) {
        querystr += " \nHAVING ";
        querystr += (req.query["minval"] !== undefined ? req.query["column"] + " >= " + req.query["minval"] + " " : "");
        if (req.query["minval"] !== undefined && req.query["maxval"] !== undefined) {
            querystr += " AND ";
        }
        querystr += (req.query["maxval"] !== undefined ? req.query["column"] + " <= " + req.query["maxval"] + " " : "");
    }

    querystr += `\nORDER BY SalesDate DESC`;
    
    // Check for if the user wants the query string
    /* http://localhost:8080/queries/monthofyear?showquerystr=1 */
    if (req.query["showquerystr"] !== undefined && req.query["showquerystr"] === '1') {
        res.send({ "query_str" : querystr});
    } else {
        // User does not want the query as a string, but want to run it and get
        // the resulting tuples
        run(querystr)
            .then(rows => {
            res.send(rows);
        });
    }
});



module.exports = router;
