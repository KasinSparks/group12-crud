import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

//STYLE SHEET FOR WEB
import "./styles.css"

//Router
import { BrowserRouter } from "react-router-dom"
import Dashboard from './pages/Dashboard';
import { useLocation, matchPath } from "react-router";
import Navigation from './Navigation';

//WIP, fix dashboard to display proper page containers
function Dash(props){
  const location = useLocation();
  const dashIDMatch = matchPath(
  {path: "/dashboard/:id", exact: true},
  location.pathname
);

if (dashIDMatch){
  console.log("dash display")
  return
}

const dashMatch = matchPath(
  {path: "/dashboard"},
  location.pathname
);

if (dashMatch){
  console.log("dash ID display")
  return <Dashboard />
}

  console.log("app display")
  return <App />
}

function DashID(props){
  const location = useLocation();
  const dashMatch = matchPath(
    {path: "/dashboard/:id"},
    location.pathname
  );

  if (dashMatch){
    console.log("id display")
    return <Dashboard />
}

}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Navigation/>
      <Dash dashMatch={true} />
      <DashID dashMatch={false} />
    </BrowserRouter>
  </React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
