import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import TimeOfYearQuery from './monthOfYearQuerys.js';


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
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
            <TestAPIConnection
              apiRes={this.state.apiResponse} 
            />
            <TimeOfYearQuery /> 
          </header>
        </div>
      );
    }
}

export default App;
