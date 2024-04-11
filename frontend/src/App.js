import React, { Component } from 'react';
import './App.css';
import Navigation from './Navigation';
import CRUD from './pages/CRUD';
import Map from './pages/Map';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './AccountButtons/Login';
import Register from './AccountButtons/Register';
import Home from './AccountButtons/Home'; // Assuming you have a basic Home component

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

function App() {
  return (
    <>
      <div className="container">
        <Routes>
          <Route path="/" element={<CRUD />} />
          <Route path="/map" element={<Map />} />
          <Route path="/dashboard" element={<Dashboard />}/> 
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>   

      
    </>
  )
 return <Navigation/>
    
}


export default App;
