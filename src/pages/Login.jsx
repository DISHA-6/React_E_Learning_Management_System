import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import users from '../data/users.json';

// Google Font import via <link> in head (since inline styles can't load fonts)
const addFont = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Lobster&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};
addFont();

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordValid = password.length >= 6;

    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!passwordValid) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      login({ name: user.name, role: user.role });
      alert('Login successful!');
      navigate('/');
    } else {
      alert('Invalid email or password.');
    }
  };

  const containerStyle = {
    backgroundColor: 'rgba(22, 28, 93, 0.75)',
    padding: '60px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    width: '100%',
    maxWidth: '550px',
    margin: '60px auto',
    textAlign: 'center',
    color: '#fff',
    fontFamily: "'Roboto', sans-serif",
  };

  const inputStyle = {
    width: '100%',
    padding: '15px',
    margin: '12px 0',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '15px',
    marginTop: '25px',
    backgroundColor: '#ffd700',
    border: 'none',
    borderRadius: '6px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#161c5d',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const linkStyle = {
    marginTop: '20px',
    display: 'block',
    fontSize: '15px',
    color: '#ffd700',
    textDecoration: 'none',
  };

  return (
    <div
      style={{
        background: 'url("/assets/images/login1.jpg") no-repeat center center fixed',
        backgroundSize: 'cover',
        minHeight: '100vh',
      }}
    >
      <div style={containerStyle}>
        <h1 style={{ fontFamily: "'Lobster', cursive", color: '#f9f9f9', marginBottom: '40px', fontSize: '36px' }}>
          Login
        </h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Login
          </button>
          <span style={{ marginTop: '20px', display: 'block', fontSize: '15px' }}>
            Don't have an account?{' '}
            <a href="/register" style={linkStyle}>
              Register
            </a>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
