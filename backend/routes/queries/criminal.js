const run = require('../../db.js');

var express = require('express');
var router = express.Router();

/* A test API endpoint */
/* http://localhost:8080/queries/criminal */
router.get('/', function(req, res, next) {
    res.send("API criminal test point. SUCCESS!");
});

/* http://localhost:8080/queries/criminal/ratio */
// NOTE: Do NOT use a production environment. Does not defend against SQL
//       injection attacks. 
router.get('/ratio', function(req, res, next) {
    //console.log(req.query);
    groupbyselectstr2 = "";
    if (req.query["year"] === "true") {
        groupbyselectstr2 += " EXTRACT(YEAR FROM sd) year, ";
    } else {
        groupbyselectstr2 += " 1 year, ";
    }

    if (req.query["month"] === "true") {
        groupbyselectstr2 += " EXTRACT(MONTH FROM sd) month, ";
    } else {
        groupbyselectstr2 += " 1 month, ";
    }

    if (req.query["day"] === "true") {
        groupbyselectstr2 += " EXTRACT(DAY FROM sd) day, ";
    } else {
        groupbyselectstr2 += " 1 day, ";
    }

    if (!(req.query["year"] || req.query["month"] || req.query["day"])) {
        groupbyselectstr2 = " EXTRACT(YEAR FROM sd) year, EXTRACT(MONTH FROM sd) month, EXTRACT(DAY FROM sd) day, ";
    }
    
    // The dynamic query string
    var querystr = "SELECT" + groupbyselectstr2 + `AVG(NumOfViolentCrimes) avgNumOfViolentCrimes, AVG(NumOfNonViolentCrimes) avgNumOfNonViolentCrimes, AVG(AverageSalesRatio) avgSalesRatio, SUM(numOfSales) totalNumOfSales
FROM
    (SELECT trunc(SalesDate) sd, AVG(SoldValue / NULLIF(AssessedValue, 0)) AS AverageSalesRatio, COUNT(KASINSPARKS.CISRealEstateSale.SalesID) numOfSales
     FROM KASINSPARKS.CISRealEstateSale
     JOIN KASINSPARKS.CISRealEstateSalesDate ON KASINSPARKS.CISRealEstateSale.SalesID = KASINSPARKS.CISRealEstateSalesDate.SalesID
     JOIN KASINSPARKS.CISLocation ON KASINSPARKS.CISRealEstateSale.LocatedAt = KASINSPARKS.CISLocation.LocationID
     WHERE KASINSPARKS.CISLocation.City = 'HARTFORD'
     GROUP BY trunc(SalesDate)),
     
    (SELECT ViolentCrimes.vcd, NumOfViolentCrimes, NumOfNonViolentCrimes
    FROM
        (SELECT trunc(DateRec) vcd, COUNT(CaseNumber) NumOfViolentCrimes
        FROM KASINSPARKS.CISPoliceIncidents, KASINSPARKS.CISIncidentHasCrimeTypes
        WHERE KASINSPARKS.CISPoliceIncidents.CaseNumber = KASINSPARKS.CISIncidentHasCrimeTypes.CaseNum AND TypeID IN (SELECT UCRCode FROM KASINSPARKS.CISViolentCrimeTypes)
        GROUP BY trunc(DateRec)) ViolentCrimes
    JOIN (
        (SELECT trunc(DateRec) nvcd, COUNT(CaseNumber) NumOfNonViolentCrimes
        FROM KASINSPARKS.CISPoliceIncidents, KASINSPARKS.CISIncidentHasCrimeTypes
        WHERE KASINSPARKS.CISPoliceIncidents.CaseNumber = KASINSPARKS.CISIncidentHasCrimeTypes.CaseNum AND TypeID IN (SELECT UCRCode NonViolentCrimeCodes
                FROM (
                (SELECT UCRCode FROM KASINSPARKS.CISCrimeTypes) MINUS (SELECT UCRCode FROM KASINSPARKS.CISViolentCrimeTypes)
             )
            )
        GROUP BY trunc(DateRec)) NonViolentCrimes
    ) ON ViolentCrimes.vcd = NonViolentCrimes.nvcd
    ORDER BY vcd ASC)
WHERE sd = vcd`;

    // If there is a start date, add it to the where clause
    if (req.query["fromdate"] !== undefined) {
        querystr += " AND sd >= TO_DATE('" + req.query["fromdate"] + "', 'YYYY-MM-DD')";
    }

    // If there is an end date, add it to the where clause
    if (req.query["todate"] !== undefined) {
        querystr += " AND sd <= TO_DATE('" + req.query["todate"] + "', 'YYYY-MM-DD')";
    }

    //querystr += `\nGROUP BY SalesDate`;
    groupbystr = "";
    if (req.query["year"] === "true") {
        groupbystr += "EXTRACT(YEAR FROM sd), ";
    }
    if (req.query["month"] === "true") {
        groupbystr += "EXTRACT(MONTH FROM sd), ";
    }
    if (req.query["day"] === "true") {
        groupbystr += "EXTRACT(DAY FROM sd), ";
    }

    if (groupbystr === "") {
        groupbystr = `\nGROUP BY EXTRACT(YEAR FROM sd), EXTRACT(MONTH FROM sd), EXTRACT(DAY FROM sd)`;
    } else {
        groupbystr = "\nGROUP BY " + groupbystr.substring(0, groupbystr.length - 2);
    }

    console.log(groupbystr);

    querystr += groupbystr;
    //querystr += `\nGROUP BY year, month, day`

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
