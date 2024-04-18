import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
//import moment from 'moment';
import 'chartjs-adapter-moment';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);


export default function Criminal() {
    return (
        <>
          <h1>Police Incident Affect on Sales Ratio Trend (City of Hartford)</h1>
          <CriminalQuery /> 
        </>
    );
}

function CriminalQuery() {
    const base_url_str = "http://localhost:8080/queries/criminal/ratio";

    // REACT States
    const [data, setData] = useState({ tuples: [] });
    const [sqlstr, setSqlstr] = useState(base_url_str);
    const [showsqlcommand, setShowsqlcommand] = useState("");

    // Used to dynmically update the screen when the React state sqlstr is changed
    useEffect(() => {
        // Get the data from the backend
        fetch(sqlstr)
            .then(res => res.json())
            .then(json => setData({ tuples: json }))
            .catch(err => err);
        
        // Used to append the showquerystr regardless if there are already
        // GET params or not.
        var http_join_char = (sqlstr.includes('?') ? '&' : '?');
        
        // Get the query string and save it to a React state
        fetch(sqlstr + http_join_char + "showquerystr=1")
            //.then(res => setShowsqlcommand(res.body))
            .then(res => res.json())
            .then(json => setShowsqlcommand(json["query_str"]))
            .catch(err => err);

        return () => {}
    }, [sqlstr]);

    // Options for the chartjs graph
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

    // Data for the chartjs graph
    const chart_data = {
        datasets: [
            {
                label: 'AVGSALESRATIO',
                data: data.tuples.map(el => {
                    return ({x: new Date(el.YEAR,  el.MONTH, el.DAY), y: el['AVGSALESRATIO']})
                }),
                backgroundColor: 'rgba(220, 127, 20, 1)',
            },
            {
                label: 'TOTALSALES',
                data: data.tuples.map(el => {
                    return ({x: new Date(el.YEAR,  el.MONTH, el.DAY), y: el['TOTALNUMOFSALES']})
                }),
                backgroundColor: 'rgba(0, 255, 0, 1)',
            },
            {
                label: 'AVGNUMOFNONVIOLENTCRIMES',
                data: data.tuples.map(el => {
                    return ({x: new Date(el.YEAR,  el.MONTH, el.DAY), y: el['AVGNUMOFNONVIOLENTCRIMES']})
                }),
                backgroundColor: 'rgba(0, 0, 255, 1)',
                pointStyle: 'rect',
            },
            {
                label: 'AVGNUMOFVIOLENTCRIMES',
                data: data.tuples.map(el => {
                    return ({x: new Date(el.YEAR,  el.MONTH, el.DAY), y: el['AVGNUMOFVIOLENTCRIMES']})
                }),
                backgroundColor: 'rgba(255, 0, 0, 1)',
                pointStyle: 'rect',
            },
        ]
    };


    // Set the GET query (i.e. url?type=apartment&minval=2)
    function setQueryString() {
        //console.log(document.getElementById("fromdate").value);
        var url_str = base_url_str + "?";

        var query_params = {
            "fromdate" : document.getElementById("fromdate").value,
            "todate"   : document.getElementById("todate").value,
            "year"     : document.getElementById("year").checked,
            "month"    : document.getElementById("month").checked,
            "day"      : document.getElementById("day").checked,
        };

        // A flag to only include a question mark at the beginning
        var is_first = true;
        // Add all the params that have a value
        for (var k in query_params) {
            var temp_str = "";
            
            if (query_params[k] !== "") {
                if (!is_first) {
                    temp_str += "&";
                }
                is_first = false;
                
                // Add name of param and the value
                temp_str += k + "=" + query_params[k];
                
                url_str += temp_str;
            }

        }
        
        // Update the React state
        setSqlstr(url_str);
    }


    // render
    return (
     <>

       <Scatter options={options} data={chart_data} />
        <div>
          <div>
            <label for="year">Year:</label>
            <input id="year" type="checkbox" name="year" defaultChecked={true} />
            <label for="month"> | month:</label>
            <input id="month" type="checkbox" name="month" defaultChecked={true} />
            <label for="day"> | day:</label>
            <input id="day" type="checkbox" name="day" defaultChecked={true} />
          </div>

          <div>
            <label for="fromdate">From: </label>
            <input id="fromdate" type="date" name="fromdate" />
            <label for="todate"> | To: </label>
            <input id="todate" type="date" name="todate" />
            <div>
              <button onClick={setQueryString}>Filter</button>
            </div>
          </div>
        </div>

        <div class="queryBox">
          <div align="left" class="sqlQuery">
            <h2>Dynamic SQL Query</h2>
            <pre>
              {showsqlcommand}
            </pre>
          </div>
          <div class="queryEx">
            <h2>Colloquial Query</h2>
            <p>If we consider different police incidents (such as larceny and assault) in the city of Hartford CT, what influence over time has crime had on sales ratios of different residential types? Has this changed over time?</p>
            <p>Crime has been a top factor for potential homeowners to consider. By including this query, users will be able to visualize how a given crime type in the City of Hartford, CT, influences the sales price of the different residential types. Additionally, if the location data is accurate enough in both datasets, another query question will be asked. How has the number of crimes in a given radius from a given property changed over time? The crime rate will be an important decision-making factor for most house seekers.</p>
          </div>
        </div>
        </>
    );
}
