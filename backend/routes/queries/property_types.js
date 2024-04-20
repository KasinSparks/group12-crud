const run = require('../../db.js');

var express = require('express');
var router = express.Router();

/* A test API endpoint */
/* http://localhost:8080/queries/propertytypes */
router.get('/', function(req, res, next) {
    res.send("API propertytypes test point. SUCCESS!");
});


// TODO: Move function out of this module and into it's own
/* http://localhost:8080/queries/propertytypes/types*/
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
/* http://localhost:8080/queries/propertytypes/cites */
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

/* http://localhost:8080/queries/properytypes/ratios */
// NOTE: Do NOT use a production environment. Does not defend against SQL
//       injection attacks. 
router.get('/ratios', function(req, res, next) {
    //console.log(req.query);
    groupbyselectstr2 = "";
    if (req.query["year"] === "true") {
        groupbyselectstr2 += " EXTRACT(YEAR FROM sd.SalesDate) year, ";
    } else {
        groupbyselectstr2 += " 0 year, ";
    }

    if (req.query["month"] === "true") {
        groupbyselectstr2 += " EXTRACT(MONTH FROM sd.SalesDate) month, ";
    } else {
        groupbyselectstr2 += " 0 month, ";
    }

    if (req.query["day"] === "true") {
        groupbyselectstr2 += " EXTRACT(DAY FROM sd.SalesDate) day, ";
    } else {
        groupbyselectstr2 += " 0 day, ";
    }

    if (!(req.query["year"] || req.query["month"] || req.query["day"])) {
        groupbyselectstr2 = " EXTRACT(YEAR FROM sd.SalesDate) year, EXTRACT(MONTH FROM sd.SalesDate) month, EXTRACT(DAY FROM sd.SalesDate) day, ";
    }
    
    // The dynamic query string
    var querystr = `SELECT` + groupbyselectstr2 +
    `\n    ROUND(AVG(CASE WHEN bis.Type = 'COMMERCIAL' THEN res.ASSESSEDVALUE / NULLIF(res.SOLDVALUE, 0) END), 2) AS COMMERCIAL_AvgSalesRatio,
    ROUND(AVG(CASE WHEN bis.Type = 'APARTMENTS' THEN res.ASSESSEDVALUE / NULLIF(res.SOLDVALUE, 0) END), 2) AS APARTMENTS_AvgSalesRatio,
    ROUND(AVG(CASE WHEN bis.Type = 'INDUSTRIAL' THEN res.ASSESSEDVALUE / NULLIF(res.SOLDVALUE, 0) END), 2) AS INDUSTRIAL_AvgSalesRatio,
    ROUND(AVG(CASE WHEN bis.Type = 'PUBLIC UTILITY' THEN res.ASSESSEDVALUE / NULLIF(res.SOLDVALUE, 0) END), 2) AS PUBLIC_UTILITY_AvgSalesRatio,
    ROUND(AVG(CASE WHEN bis.Type = 'CONDO' THEN res.ASSESSEDVALUE / NULLIF(res.SOLDVALUE, 0) END), 2) AS CONDO_AvgSalesRatio,
    ROUND(AVG(CASE WHEN bis.Type = 'FOUR FAMILY' OR bis.Type = 'THREE FAMILY' THEN res.ASSESSEDVALUE / NULLIF(res.SOLDVALUE, 0) END), 2) AS MULTIFAM_AvgSalesRatio,
    ROUND(AVG(CASE WHEN bis.Type = 'SINGLE FAMILY' THEN res.ASSESSEDVALUE / NULLIF(res.SOLDVALUE, 0) END), 2) AS SINGLEFAM_AvgSalesRatio,
    ROUND(AVG(CASE WHEN bis.Type = 'VACANT LAND' THEN res.ASSESSEDVALUE / NULLIF(res.SOLDVALUE, 0) END), 2) AS VACANTLAND_AvgSalesRatio
`;

    querystr += "\nFROM KASINSPARKS.CISRealEstateSale res";
    //querystr += "\nJOIN KASINSPARKS.CISBusiness bis ON res.SalesID = bis.SalesID";
    querystr += "\nJOIN "
    querystr += `\n    (SELECT SalesID, Type 
     FROM (
       (SELECT SalesID, Type
       FROM KASINSPARKS.CISResidential)
       UNION 
       (SELECT SalesID, Type
       FROM KASINSPARKS.CISBusiness)
      )) bis`;
    querystr += "\n ON res.SalesID = bis.SalesID";
    querystr += "\nJOIN KASINSPARKS.CISRealEstateSalesDate sd ON sd.SalesID= res.SalesID";
    querystr += "\nJOIN KASINSPARKS.CISLocation loc ON loc.LOCATIONID = res.LocatedAt";


    
    // If there is a start date, add it to the where clause
    if (req.query["fromdate"] !== undefined) {
        querystr += "\nWHERE SalesDate >= TO_DATE('" + req.query["fromdate"] + "', 'YYYY-MM-DD')";
    } else {
        querystr += "\nWHERE SalesDate >= TO_DATE('1900/01/01', 'YYYY-MM-DD')";
    }

    // If there is an end date, add it to the where clause
    if (req.query["todate"] !== undefined) {
        querystr += " AND SalesDate <= TO_DATE('" + req.query["todate"] + "', 'YYYY-MM-DD')";
    }

    // If there is a city specified, add it to the where clause
    if (req.query["city"] !== undefined) {
        querystr += " AND City = '" + req.query["city"] + "'";
    }

    // If there is a minumum or maximum value for a given column specified, add it to the having clause
    //
    if (req.query["minval"] !== undefined) {
        querystr += " AND (res.AssessedValue / NULLIF(res.SoldValue, 0) >= " + req.query["minval"] + ")";
    }

    if (req.query["maxval"] !== undefined) {
        querystr += " AND (res.AssessedValue / NULLIF(res.SoldValue, 0) <= " + req.query["maxval"] + ")";
    }


    //querystr += `\nGROUP BY SalesDate`;
    groupbystr = "";
    if (req.query["year"] === "true") {
        groupbystr += "EXTRACT(YEAR FROM sd.SalesDate), ";
    }
    if (req.query["month"] === "true") {
        groupbystr += "EXTRACT(MONTH FROM sd.SalesDate), ";
    }
    if (req.query["day"] === "true") {
        groupbystr += "EXTRACT(DAY FROM sd.SalesDate), ";
    }

    if (groupbystr === "") {
        groupbystr = "\nGROUP BY EXTRACT(YEAR FROM sd.SalesDate), EXTRACT(MONTH FROM sd.SalesDate), EXTRACT(DAY FROM sd.SalesDate)";
    } else {
        groupbystr = "\nGROUP BY " + groupbystr.substring(0, groupbystr.length - 2);
    }


    querystr += groupbystr;

    console.log(querystr);

    //querystr += "\nORDER BY sd.SalesDate DESC";
    
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


router.get('/ratios/minmax', function(req, res, next) {
    //console.log(req.query);
    groupbyselectstr2 = "";
    if (req.query["year"] === "true") {
        groupbyselectstr2 += " EXTRACT(YEAR FROM sd.SalesDate) year, ";
    } else {
        groupbyselectstr2 += " 1 year, ";
    }

    if (req.query["month"] === "true") {
        groupbyselectstr2 += " EXTRACT(MONTH FROM sd.SalesDate) month, ";
    } else {
        groupbyselectstr2 += " 1 month, ";
    }

    if (req.query["day"] === "true") {
        groupbyselectstr2 += " EXTRACT(DAY FROM sd.SalesDate) day, ";
    } else {
        groupbyselectstr2 += " 1 day, ";
    }

    if (!(req.query["year"] || req.query["month"] || req.query["day"])) {
        groupbyselectstr2 = " EXTRACT(YEAR FROM sd.SalesDate) year, EXTRACT(MONTH FROM sd.SalesDate) month, EXTRACT(DAY FROM sd.SalesDate) day, ";
    }
    
    // The dynamic query string
    var querystr = `SELECT year, month, day, Highest, Lowest
FROM (
    SELECT
    ` + groupbyselectstr2 +
    `\n    ROUND(MAX(res.ASSESSEDVALUE / NULLIF(res.SOLDVALUE, 0)), 2) AS Highest,
    ROUND(MIN(res.ASSESSEDVALUE / NULLIF(res.SOLDVALUE, 0)), 2) AS Lowest`;

    querystr += "\nFROM KASINSPARKS.CISRealEstateSale res";
    //querystr += "\nJOIN KASINSPARKS.CISBusiness bis ON res.SalesID = bis.SalesID";
    querystr += "\nJOIN "
    querystr += `\n    (SELECT SalesID, Type 
     FROM (
       (SELECT SalesID, Type
       FROM KASINSPARKS.CISResidential)
       UNION 
       (SELECT SalesID, Type
       FROM KASINSPARKS.CISBusiness)
      )) bis`;
    querystr += "\n ON res.SalesID = bis.SalesID";

    querystr += "\nJOIN KASINSPARKS.CISRealEstateSalesDate sd ON sd.SalesID= res.SalesID";
    querystr += "\nJOIN KASINSPARKS.CISLocation loc ON loc.LOCATIONID = res.LocatedAt";


    // If there is a start date, add it to the where clause
    if (req.query["fromdate"] !== undefined) {
        querystr += "\nWHERE SalesDate >= TO_DATE('" + req.query["fromdate"] + "', 'YYYY-MM-DD')";
    } else {
        querystr += "\nWHERE SalesDate >= TO_DATE('1900/01/01', 'YYYY-MM-DD')";
    }

    // If there is a city specified, add it to the where clause
    if (req.query["city"] !== undefined) {
        querystr += " AND City = '" + req.query["city"] + "'";
    }

    if (req.query["type"] !== undefined) {
        querystr += " AND Type = '" + req.query["type"] + "'";
    }


    // If there is an end date, add it to the where clause
    if (req.query["todate"] !== undefined) {
        querystr += " AND SalesDate <= TO_DATE('" + req.query["todate"] + "', 'YYYY-MM-DD')";
    }

    //querystr += `\nGROUP BY SalesDate`;
    groupbystr = "";
    if (req.query["year"] === "true") {
        groupbystr += "EXTRACT(YEAR FROM sd.SalesDate), ";
    }
    if (req.query["month"] === "true") {
        groupbystr += "EXTRACT(MONTH FROM sd.SalesDate), ";
    }
    if (req.query["day"] === "true") {
        groupbystr += "EXTRACT(DAY FROM sd.SalesDate), ";
    }

    if (groupbystr === "") {
        groupbystr = "\nGROUP BY EXTRACT(YEAR FROM sd.SalesDate), EXTRACT(MONTH FROM sd.SalesDate), EXTRACT(DAY FROM sd.SalesDate)";
    } else {
        groupbystr = "\nGROUP BY " + groupbystr.substring(0, groupbystr.length - 2);
    }


    querystr += groupbystr + ")";

    if (req.query["minval"] !== undefined) {
        querystr += "\nWHERE Highest >= " + req.query["minval"];
    } else {
        querystr += "\nWHERE Highest >= 0";
    }

    if (req.query["maxval"] !== undefined) {
        querystr += " AND Highest <= " + req.query["maxval"];
    }

    console.log(querystr);

    //querystr += "\nORDER BY sd.SalesDate DESC";
    
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
