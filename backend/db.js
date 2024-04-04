// Modified from https://node-oracledb.readthedocs.io/en/latest/user_guide/installation.html#installation

const oracledb = require('oracledb');
const fs = require('node:fs');
const dbConfig = require('./dbConfig.js');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function run(query_str) {
    
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(query_str);

    console.log(result.rows);
    await connection.close();
    return await result.rows;
}

//run();
module.exports = run;
