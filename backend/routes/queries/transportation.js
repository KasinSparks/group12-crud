const run = require('../../db.js');

var express = require('express');
var router = express.Router();

/* A test API endpoint */
/* http://localhost:8080/queries/transportation */
router.get('/', function(req, res, next) {
    res.send("API transportation test point. SUCCESS!");
});

// TODO: Move function out of this module and into it's own
/* http://localhost:8080/queries/transportation/types*/
// Sends an array of the different types of Real Estate properties
router.get('/types', function(req, res, next) {
    var querystr = 
            `SELECT DISTINCT Type 
             FROM (
               (SELECT SalesID, Type
               FROM KASINSPARKS.CISResidential)
               UNION 
               (SELECT SalesID, Type
               FROM KASINSPARKS.CISBusiness)
              )`;

    run(querystr)
        .then(rows => {
        res.send(rows);
    });
});

// TODO: Move function out of this module and into it's own
/* http://localhost:8080/queries/transportation/cites */
// Sends an array of the different types of Real Estate properties
router.get('/cities', function(req, res, next) {
    var querystr = 
            `SELECT DISTINCT City 
             FROM KASINSPARKS.CISLocation
             ORDER BY City DESC`;

    run(querystr)
        .then(rows => {
        res.send(rows);
    });
});

/* http://localhost:8080/queries/monthofyear/avgsales */
// NOTE: Do NOT use a production environment. Does not defend against SQL
//       injection attacks. 
router.get('/traffic', function(req, res, next) {
    // The dynamic query string
    var querystr = `SELECT CitySales.dateSold propertySaleDate, CityTraffic.t_date trafficEventDate, numOfSales, avgTrafficJamDuration avgTrafficJamDurationMinutes, (avgTrafficJamDuration * 60) avgTrafficJamDurationSec
FROM 
    (SELECT trunc(SalesDate) dateSold, COUNT(salesLoc.SalesID) numOfSales
     FROM KASINSPARKS.CISRealEstateSalesDate, (
        SELECT KASINSPARKS.CISRealEstateSale.SalesID, City, Type p_type
        FROM KASINSPARKS.CISRealEstateSale, KASINSPARKS.CISLocation, (
            ((SELECT SalesID, Type
            FROM KASINSPARKS.CISResidential)
            UNION
            (SELECT SalesID, Type
            FROM KASINSPARKS.CISBusiness)) property_types
        )
        WHERE KASINSPARKS.CISRealEstateSale.LocatedAt = KASINSPARKS.CISLocation.LocationID AND property_types.SalesID = CISRealEstateSale.SalesID) salesLoc
     WHERE KASINSPARKS.CISRealEstateSalesDate.SalesID = salesLoc.SalesID`;

    // If there is a city specified, add it to the where clause
    if (req.query["city"] !== undefined) {
        querystr += " AND City = '" + req.query["city"] + "'";
    }

    // If there is a property type specified, add it to the where clause
    if (req.query["type"] !== undefined) {
        querystr += " AND p_type = '" + req.query["type"] + "'";
    }

    querystr += `\n     GROUP BY trunc(SalesDate)
     ORDER BY trunc(SalesDate)
     ) CitySales
FULL OUTER JOIN
    (SELECT trunc(DateRec) t_date, AVG(DURATION) avgTrafficJamDuration
    FROM KASINSPARKS.CISTraffic, KASINSPARKS.CISLocation
    WHERE KASINSPARKS.CISTraffic.LocRec = KASINSPARKS.CISLocation.LocationID`

    // If there is a city specified, add it to the where clause
    if (req.query["city"] !== undefined) {
        querystr += " AND City = '" + req.query["city"] + "'";
    }
    
    querystr += `\n    GROUP BY trunc(DateRec)
    HAVING AVG(DURATION) >= 0
    ORDER BY trunc(DateRec) ASC
    ) CityTraffic
ON CitySales.dateSold = CityTraffic.t_date
WHERE`;

    // If there is a start date, add it to the where clause
    if (req.query["fromdate"] !== undefined) {
        querystr += " CitySales.dateSold >= TO_DATE('" + req.query["fromdate"] + "', 'YYYY-MM-DD')";
    } else {
        querystr += " CitySales.dateSold >= TO_DATE('2001-01-01', 'YYYY-MM-DD')";
    }


    // If there is an end date, add it to the where clause
    if (req.query["todate"] !== undefined) {
        querystr += " AND CitySales.dateSold <= TO_DATE('" + req.query["todate"] + "', 'YYYY-MM-DD')";
    } else {
        querystr += " AND CitySales.dateSold <= TO_DATE('2050-01-01', 'YYYY-MM-DD')";
    }

    querystr += `\nORDER BY DateSold DESC`;
    
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
