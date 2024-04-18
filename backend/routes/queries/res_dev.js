const run = require('../../db.js');

var express = require('express');
var router = express.Router();

/* http://localhost:8080/queries/resdev */
// NOTE: Do NOT use a production environment. Does not defend against SQL
//       injection attacks. 
router.get('/', function(req, res, next) {
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
    `\n  COUNT(CASE WHEN resType.Type = 'CONDO' THEN resSale.SalesID END) AS CONDO_Sales,
  COUNT(CASE WHEN resType.Type = 'FOUR FAMILY' OR resType.Type = 'THREE FAMILY' OR resType.Type = 'TWO FAMILY' THEN resSale.SalesID END) AS MULTIFAM_Sales,
  COUNT(CASE WHEN resType.Type = 'SINGLE FAMILY' THEN resSale.SalesID END) AS SINGLEFAM_Sales`;

    querystr += "\nFROM KASINSPARKS.CISRealEstateSale resSale";
    querystr += "\nJOIN KASINSPARKS.CISResidential resType ON resSale.SalesID = resType.SalesID";
    querystr += "\nJOIN KASINSPARKS.CISRealEstateSalesDate sd ON sd.SalesID= resSale.SalesID";
    querystr += "\nJOIN KASINSPARKS.CISLocation loc ON loc.LOCATIONID = resSale.LocatedAt";


    
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


module.exports = router;
