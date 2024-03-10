// Modified from https://node-oracledb.readthedocs.io/en/latest/user_guide/installation.html#installation

const oracledb = require('oracledb');
const fs = require('node:fs');
const dbConfig = require('./dbConfig.js');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function run() {
    
    const connection = await oracledb.getConnection (dbConfig);

    const result = await connection.execute(
        `SELECT *
         FROM City`,
    );

    console.log(result.rows);
    await connection.close();
}

run();
