import React, { Component, useEffect, useState } from 'react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import moment from 'moment';
import 'chartjs-adapter-moment';
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);


export default function TimeOfYearQuery() {
    const [data, setData] = useState({ tuples: [] });

    useEffect(() => {
        let ignore = false;
        fetch("http://localhost:8080/test/query_test")
            .then(res => res.json())
            .then(json => setData({ tuples: json}))
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
                label: 'CISTESTDATA',
                //data: [{x: 0, y: 1}],
                data: data.tuples.map(el => (
                    {x: el.SALESDATE, y: el['COUNT(*)']}
                )),
                backgroundColor: 'rgba(255, 99, 132, 1)',
            },
            {
                label: 'CISTESTDATA2',
                data: data.tuples.map(el => (
                    {x: el.SALESDATE, y: el['AVG(AVGTEMP)']}
                )),
                backgroundColor: 'rgba(9, 99, 132, 1)',
            },
        ],
    };

    return (
     <>

       <Scatter options={options} data={chart_data} />
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
