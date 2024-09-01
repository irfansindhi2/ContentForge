import React, { useState, useEffect } from 'react';

function Login() {
  const [site, setSite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Set the site from the URL query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const siteParam = urlParams.get('site');
    if (siteParam) {
      setSite(siteParam);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build the login URL with the site parameter
    const loginUrl = `${process.env.REACT_APP_API_URL}/api/login?site=${encodeURIComponent(site)}`;

    // Submit the form data to the backend
    fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',  // Ensure cookies are included in the request
    })
      .then(response => response.json())
      .then(data => {
        if (data.redirectTo) {
          // Redirect after login
          window.location.href = data.redirectTo;
        }
      })
      .catch(error => {
        console.error('Error during login:', error);
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br /><br />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />

        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default Login;
