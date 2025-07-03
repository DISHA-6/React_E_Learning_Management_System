import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import initialUsers from '../data/users.json';

// Add Lobster font dynamically
const addFont = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Lobster&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  useEffect(() => {
    addFont();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, role } = form;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    if (!name || !email || !password || !confirmPassword || !role) {
      alert('Please fill in all fields.');
      return;
    }

    if (!emailRegex.test(email)) {
      alert('Invalid email format.');
      return;
    }

    if (!passwordRegex.test(password)) {
      alert('Password must be at least 8 characters and include letters and numbers.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (users.find((u) => u.email === email)) {
      alert('This email is already registered.');
      return;
    }

    const newUser = { name, email, password, role };
    setUsers([...users, newUser]);
    login({ name, role });
    alert('Registered successfully!');
    navigate('/');
  };

  const backgroundStyle = {
    background: 'url("/assets/images/login1.jpg") no-repeat center center fixed',
    backgroundSize: 'cover',
    minHeight: '100vh',
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
    fontFamily: "'Roboto', sans-serif"
  };

  const headingStyle = {
    fontFamily: "'Lobster', cursive",
    color: '#f9f9f9',
    marginBottom: '30px',
    fontSize: '36px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '15px',
    backgroundColor: '#ffd700',
    border: 'none',
    borderRadius: '6px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#161c5d',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  const linkStyle = {
    marginTop: '20px',
    fontSize: '15px',
    color: '#ffd700',
    textDecoration: 'none'
  };

  return (
    <div style={backgroundStyle}>
      <div style={containerStyle}>
        <h1 style={headingStyle}>Register</h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button type="submit" style={buttonStyle}>Register</button>
          <p style={{ marginTop: '20px', fontSize: '15px' }}>
            Already have an account?{' '}
            <a href="/login" style={linkStyle}>Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
