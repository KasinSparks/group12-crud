import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Account.css'; // Ensure this points to wherever your styles are defined

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [isLoginSuccess, setIsLoginSuccess] = useState(false); // State to track if login is successful

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Replace this with real validation logic and handle asynchronous operations properly
        if (username === "validUsername" && password === "validPassword") {
            setLoginMessage("Successful login!");
            setIsLoginSuccess(true);
            // Redirect user to their dashboard or home page here if necessary
        } else {
            setLoginMessage("Incorrect email or password, or account does not exist.");
            setIsLoginSuccess(false);
        }
    };

    return (
        <div className="account-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username: </label>
                    <div className="boxes">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label>Password: </label>
                    <div className="boxes">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                {/* Conditional rendering for login message with color based on success or error */}
                {loginMessage && (
                    <div
                        className="login-message"
                        style={{ color: isLoginSuccess ? 'green' : 'red' }}
                    >
                        {loginMessage}
                    </div>
                )}
                <button type="submit">Log In</button>
                <p className="account-prompt">
                    Don't have an account? <Link to="/register">Make one here</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
