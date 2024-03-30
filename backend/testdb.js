// Modified from https://node-oracledb.readthedocs.io/en/latest/user_guide/installation.html#installation

const oracledb = require('oracledb');
const fs = require('node:fs');
const dbConfig = require('./dbConfig.js');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function run() {
    
    const connection = await oracledb.getConnection (dbConfig);

    const result = await connection.execute(
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
         ORDER BY SalesDate DESC`
    );



    console.log(result.rows);
    await connection.close();
    return await result.rows;
}

//run();
module.exports = run;
