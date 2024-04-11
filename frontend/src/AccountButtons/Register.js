import './Account.css';
import React, { useState } from 'react';

function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // New state for success message

    const handleSubmit = (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return; // Stop the form from submitting
        }

        // Assuming the form is now valid
        setError(""); // Clear any previous errors
        setSuccess("Account created successfully! Please log in."); // Set success message
        console.log('Registering with:', email, username, password);
        
        // Simulate API call and reset form
        setTimeout(() => {
            // Reset all input fields
            setEmail('');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
        }, 2000); // Delay to simulate API call
        
        // Further actions like redirecting the user or updating the global state can be done here
    };

    return (
        <div className="account-container">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email: </label>
                    <div className="boxes">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>
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
                <div>
                    <label>Re-type Password: </label>
                    <div className="boxes">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <button type="submit">Create Account</button>
            </form>
        </div>
    );
}

export default Register;
