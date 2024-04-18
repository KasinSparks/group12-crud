import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
//import moment from 'moment';
import 'chartjs-adapter-moment';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);


export default function PropertyTypes() {
    const [showMinMax, setShowMinMax] = useState(false);

    const handleClick = event => {
        setShowMinMax(!showMinMax);
    };

    return (
        <>
          <div align="center" class="mypadding">
            <button onClick={handleClick}>
              {(showMinMax === false) && "Show Min./Max."}
              {(showMinMax === true) && "Show Avg."}
            </button>
          </div>
          {(showMinMax === false) && 
            <div>
              <h1>Property Types Average Trend</h1>
              <PropertyTypesQuery />
            </div>
          }
          
          {(showMinMax === true) &&
            <div>
              <h1>Property Types Min. and Max. Trend</h1>
              <PropertyTypesMinMaxQuery />
            </div>
          }
        </>
    );
}

function PropertyTypesQuery() {
    const base_url_str = "http://localhost:8080/queries/propertytypes/ratios";

    // REACT States
    const [data, setData] = useState({ tuples: [] });
    const [sqlstr, setSqlstr] = useState(base_url_str);
    const [showsqlcommand, setShowsqlcommand] = useState("");
    const [cities, setCities] = useState([]);

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

    // Get the different real estate types from the db
    useEffect(() => {

        // Get all the cities
        fetch("http://localhost:8080/queries/monthofyear/cities")
            .then(res => res.json())
            .then(json => setCities(json))
            .catch(err => err);

        return () => {}
    }, []);
    
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
                label: "Apartment Avg. Sales Ratio",
                data: data.tuples.map(el => {
                    return ({x: new Date(el.YEAR,  el.MONTH, el.DAY), y: el["APARTMENTS_AVGSALESRATIO"]})
                }),
                backgroundColor: 'rgba(255, 0, 0, 1)',
                pointStyle: 'rect',
            },
            {
                label: "Commercial Avg. Sales Ratio",
                data: data.tuples.map(el => {
                    return ({x: new Date(el.YEAR,  el.MONTH, el.DAY), y: el["COMMERCIAL_AVGSALESRATIO"]})
                }),
                backgroundColor: 'rgba(0, 255, 0, 1)',
            },
            {
                label: "Industrial Avg. Sales Ratio",
                data: data.tuples.map(el => {
                    return ({x: new Date(el.YEAR,  el.MONTH, el.DAY), y: el["INDUSTRIAL_AVGSALESRATIO"]})
                }),
                backgroundColor: 'rgba(0, 0, 255, 1)',
            },
            {
                label: "Public Utility Avg. Sales Ratio",
                data: data.tuples.map(el => {
                    return ({x: new Date(el.YEAR,  el.MONTH, el.DAY), y: el["PUBLIC_UTILITY_AVGSALESRATIO"]})
                }),
                backgroundColor: 'rgba(232, 120, 32, 1)',
            },
            {
                label: "Condo Avg. Sales Ratio",
                data: data.tuples.map(el => {
                    return ({x: new Date(el.YEAR,  el.MONTH, el.DAY), y: el["CONDO_AVGSALESRATIO"]})
                }),
                backgroundColor: 'rgba(255, 0, 255, 1)',
            },
            {
                label: "Multi-Family Avg. Sales Ratio",
                data: data.tuples.map(el => {
                    return ({x: new Date(el.YEAR,  el.MONTH, el.DAY), y: el["MULTIFAM_AVGSALESRATIO"]})
                }),
                backgroundColor: 'rgba(20, 127, 255, 1)',
            },
            {
                label: "Single-Family Avg. Sales Ratio",
                data: data.tuples.map(el => {
                    return ({x: new Date(el.YEAR,  el.MONTH, el.DAY), y: el["SINGLEFAM_AVGSALESRATIO"]})
                }),
                backgroundColor: 'rgba(255, 127, 20, 1)',
            },
            {
                label: "Vacant Land Avg. Sales Ratio",
                data: data.tuples.map(el => {
                    return ({x: new Date(el.YEAR,  el.MONTH, el.DAY), y: el["VACANTLAND_AVGSALESRATIO"]})
                }),
                backgroundColor: 'rgba(127, 20, 255, 1)',
            },
        ],
    };

    // Set the GET query (i.e. url?type=apartment&minval=2)
    function setQueryString() {
        //console.log(document.getElementById("fromdate").value);
        var url_str = base_url_str + "?";

        var query_params = {
            "fromdate" : document.getElementById("fromdate").value,
            "todate"   : document.getElementById("todate").value,
            "city"     : document.getElementById("city").value,
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
    
    var city_rows = [];
    for (var i = 0; i < cities.length; ++i) {
        city_rows.push(cities[i]["CITY"]);
        city_rows.sort();
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
            <label for="city"> | City: </label>
            <select name="city" id="city">
                <option value=""></option>
                {city_rows.map(city => (
                    <option value={city}>{city}</option>
                ))}
            </select>

            <div>
              <button onClick={setQueryString}>Filter</button>
            </div>
          </div>
        </div>

        <div align="left">
          <pre>
            {showsqlcommand}
          </pre>
        </div>
        </>
    );
}


function PropertyTypesMinMaxQuery() {
    const base_url_str = "http://localhost:8080/queries/propertytypes/ratios/minmax";

    // REACT States
    const [data, setData] = useState({ tuples: [] });
    const [sqlstr, setSqlstr] = useState(base_url_str);
    const [showsqlcommand, setShowsqlcommand] = useState("");
    const [types, setTypes] = useState([]);
    const [cities, setCities] = useState([]);
    //const [colSelect, setColSelect] = useState("NUMOFSALES");

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

    // Get the different real estate types from the db
    useEffect(() => {
        fetch("http://localhost:8080/queries/monthofyear/types")
            .then(res => res.json())
            .then(json => setTypes(json))
            .catch(err => err);

        // Get all the cities
        fetch("http://localhost:8080/queries/monthofyear/cities")
            .then(res => res.json())
            .then(json => setCities(json))
            .catch(err => err);

        return () => {}
    }, []);
    
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
                label: "MAX Sales Ratio",
                data: data.tuples.map(el => {
                    return ({x: new Date(el.YEAR,  el.MONTH, el.DAY), y: el["HIGHEST"]})
                }),
                backgroundColor: 'rgba(255, 0, 0, 1)',
                pointStyle: 'rect',
            },
            {
                label: "MIN Sales Ratio",
                data: data.tuples.map(el => {
                    return ({x: new Date(el.YEAR,  el.MONTH, el.DAY), y: el["LOWEST"]})
                }),
                backgroundColor: 'rgba(0, 255, 0, 1)',
            },
        ],
    };

    // Set the GET query (i.e. url?type=apartment&minval=2)
    function setQueryString() {
        //console.log(document.getElementById("fromdate").value);
        var url_str = base_url_str + "?";

        var query_params = {
            "fromdate" : document.getElementById("fromdate").value,
            "todate"   : document.getElementById("todate").value,
            "type"     : document.getElementById("property_type").value,
            "minval"   : document.getElementById("min_val").value,
            "maxval"   : document.getElementById("max_val").value,
            "city"     : document.getElementById("city").value,
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
    
    
    // Add the types to a js array so we can loop over them in a map later
    var property_type_rows = [];
    for (var i = 0; i < types.length; ++i) {
        property_type_rows.push(types[i]["TYPE"]);
    }

    var city_rows = [];
    for (var i = 0; i < cities.length; ++i) {
        city_rows.push(cities[i]["CITY"]);
        city_rows.sort();
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
            <label for="min_val"> | Min Value: </label>
            <input id="min_val" type="number" name="min_val" placeholder="0" />
            <label for="max_val"> | Max Value: </label>
            <input id="max_val" type="number" name="max_val" />
            <label for="property_type"> | Property Type: </label>
            <select name="property_type" id="property_type">
                <option value=""></option>
                {property_type_rows.map(p_type => (
                    <option value={p_type}>{p_type}</option>
                ))}
            </select>
            <label for="city"> | City: </label>
            <select name="city" id="city">
                <option value=""></option>
                {city_rows.map(city => (
                    <option value={city}>{city}</option>
                ))}
            </select>

            <div>
              <button onClick={setQueryString}>Filter</button>
            </div>
          </div>
        </div>

        <div align="left">
          <pre>
            {showsqlcommand}
          </pre>
        </div>
        </>
    );
}
