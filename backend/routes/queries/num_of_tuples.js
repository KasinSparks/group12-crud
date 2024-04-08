const run = require('../../db.js');

var express = require('express');
var router = express.Router();

/* http://localhost:8080/queries/numoftuples */
// NOTE: Do NOT use a production environment. Does not defend against SQL
//       injection attacks. 
router.get('/', function(req, res, next) {
    var table_name = req.query["tablename"];
    console.log(table_name);
    if (table_name === undefined) {
        res.send("Unknown table name.");
        return;
    }

    var querystr = 
            "SELECT COUNT(*) FROM " + table_name ;

    run(querystr)
        .then(rows => {
        res.send(rows);
    });
});


module.exports = router;
