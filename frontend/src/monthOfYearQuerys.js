import React, { Component, useEffect, useState } from 'react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import moment from 'moment';
import 'chartjs-adapter-moment';
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);


export default function TimeOfYearQuery() {
    // TODO: change back to localhost
    const base_url_str = "http://192.168.20.2:8080/queries/monthofyear/avgsales";

    // REACT States
    const [data, setData] = useState({ tuples: [] });
    const [sqlstr, setSqlstr] = useState(base_url_str);
    const [showsqlcommand, setShowsqlcommand] = useState("");
    const [types, setTypes] = useState([]);

    useEffect(() => {
        let ignore = false;
        fetch(sqlstr)
            .then(res => res.json())
            .then(json => setData({ tuples: json }))
            .catch(err => err);

        var http_join_char = (sqlstr.includes('?') ? '&' : '?');

        fetch(sqlstr + http_join_char + "showquerystr=1")
            //.then(res => setShowsqlcommand(res.body))
            .then(res => res.json())
            .then(json => setShowsqlcommand(json["query_str"]))
            .catch(err => err);

        return () => {
            ignore = true;
        }
    }, [sqlstr]);

    useEffect(() => {
        let ignore = false;
        // TODO: change back to localhost
        fetch("http://192.168.20.2:8080/queries/monthofyear/types")
            .then(res => res.json())
            .then(json => setTypes(json))
            .catch(err => err);

        return () => {
            ignore = true;
        }
    }, []);

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                type: 'time',
            },
        },
    };

    const chart_data = {
        datasets: [
            {
                label: 'Connecticut Daily Number of Real Estate Sales',
                //data: [{x: 0, y: 1}],
                data: data.tuples.map(el => (
                    {x: el.SALESDATE, y: el['COUNT(CISREALESTATESALE.SALESID)']}
                )),
                backgroundColor: 'rgba(255, 99, 132, 1)',
            },
            {
                label: 'Connecticut Daily Average Temperature',
                data: data.tuples.map(el => (
                    {x: el.SALESDATE, y: el['AVG(AVGTEMP)']}
                )),
                backgroundColor: 'rgba(9, 99, 132, 1)',
                pointStyle: 'rect',
            },
        ],
    };

    function setQueryString() {
        //console.log(document.getElementById("fromdate").value);
        var url_str = base_url_str + "?";

        var query_params = {
            "fromdate" : document.getElementById("fromdate").value,
            "todate"   : document.getElementById("todate").value,
            "type"     : document.getElementById("property_type").value,
        };

        var is_first = true;
        for (var k in query_params) {
            var temp_str = "";
            
            if (query_params[k] !== "") {
                if (!is_first) {
                    temp_str += "&";
                }
                is_first = false;

                temp_str += k + "=" + query_params[k];

                url_str += temp_str;
            }

        }

        setSqlstr(url_str);
    }

    var property_type_rows = [];
    for (var i = 0; i < types.length; ++i) {
        property_type_rows.push(types[i]["TYPE"]);
    }

    var sql_command_lines = showsqlcommand.split("\n");

    return (
     <>

       <Scatter options={options} data={chart_data} />
        <label for="fromdate">From: </label>
        <input id="fromdate" type="date" name="fromdate" />
        <label for="todate">To: </label>
        <input id="todate" type="date" name="todate" />
        <label for="property_type">Property Type: </label>
        <select name="property_type" id="property_type">
            <option value=""></option>
            {property_type_rows.map(p_type => (
                <option value={p_type}>{p_type}</option>
            ))}
        </select>
        <button onClick={setQueryString}>Filter</button>

        <div>
            {sql_command_lines.map(cl => (
                <p>{cl}</p>
            ))}
            
        </div>
        </>
    );
}

/*
       <div>
         <ul>
           {data.tuples.map(el => (
             <li>
               {el.SALESDATE}, {el['COUNT(*)']}, {el['AVG(AVGTEMP)']}, {el['AVG(SNOWDEPTH)']}
             </li>
           ))}
         </ul>
       </div> 
       */
