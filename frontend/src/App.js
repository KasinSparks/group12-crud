import React, { Component } from 'react';
import './App.css';
import Navigation from './Navigation';
import CRUD from './pages/CRUD';
import Map from './pages/Map';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import { Route, Routes } from 'react-router-dom';

//Dashboard Imports
import ResidentialDashboard from './pages/dashpages/residentalDashboard';
import ResidentialDevelopment from './pages/dashpages/residentialDevelopment';
import PropertyInvestment from './pages/dashpages/propertyInvestment';
import MonthlySales from './pages/dashpages/monthlySales';
import PropertyTypes from './pages/dashpages/propertyTypes';
import HumanImpact from './pages/dashpages/humanImpact';
import Environmental from './pages/dashpages/environmental';
import Criminal from './pages/dashpages/criminal';
import Transportation from './pages/dashpages/transportation';
import DashNavigation from './pages/dashNavigation';

/*Template Imports
ChartJS.register(ArcElement, Tooltip, Legend);
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import logo from './logo.svg';
*/

function App() {
  return (
    <>
      <div className="container">
        <Routes>
          <Route path="/" element={<CRUD />} />
          <Route path="/map" element={<Map />} />
          <Route path="/dashboard" element={<Dashboard />}/> 
          <Route path="/about" element={<About />} />
        </Routes>
      </div>   

      
    </>
  )
 return <Navigation/>
    
}

/*

// https://react.dev/learn/conditional-rendering
function TestAPIConnection({ apiRes }) {
    if (apiRes !== "") {
        return <p color="green" className="App-intro">{ apiRes }</p>;
    }

    return <p color="red" className="App-intro">NO CONNECTION TO BACKEND API</p>;
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {apiResponse: "" };
        
        // Used as an example for Chart.js
        this.data = {
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
        }
    }
    
    // Used as an example to test connection to the API backend
    callAPI() {
        fetch("http://localhost:8080/test")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
    }

    render() {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <TestAPIConnection
              apiRes={this.state.apiResponse} 
            />
            <Doughnut data={this.data} />
          </header>
        </div>
      );
    }
}
*/

export default App;
