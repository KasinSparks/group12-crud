import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import './Account.css';
import Login from './Login';
import Register from './Register';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Home from './Home'; // Assuming you have a basic Home component

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
    const [apiResponse, setApiResponse] = useState("");

    const data = {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          label: '# of Votes',
          data: [42, 314, 217],
          backgroundColor: [
            'rgba(255,  99, 132, 0.5)',
            'rgba( 54, 162, 235, 0.5)',
            'rgba(255, 206,  86, 0.5)',
          ],
          borderColor: [
            'rgba(255,  99, 132, 1)',
            'rgba( 54, 162, 235, 1)',
            'rgba(255, 206,  86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    useEffect(() => {
        const callAPI = () => {
            fetch("http://localhost:8080/test")
                .then(res => res.text())
                .then(res => setApiResponse(res))
                .catch(err => console.error(err));
        };
        callAPI();
    }, []);

    function TestAPIConnection({ apiRes }) {
        if (apiRes !== "") {
            return <p style={{ color: 'green' }} className="App-intro">{apiRes}</p>;
        }
        return <p style={{ color: 'red' }} className="App-intro">NO CONNECTION TO BACKEND API</p>;
    }

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <div className="header-content">
                        {/*<img src={logo} className="App-logo" alt="logo" />*/}
                        <nav className="nav-links">
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/login">Login</Link></li>
                                {/*<li><Link to="/register">Register</Link></li>*/}
                            </ul>
                        </nav>
                    </div>
                    {/*<TestAPIConnection apiRes={apiResponse} />
                    <Doughnut data={data} />*/}
                </header>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
