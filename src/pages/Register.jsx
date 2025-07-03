import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import initialUsers from '../data/users.json';
import '../styles/register.css'; // keep styles here

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, role } = form;

    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$/;

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

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <button type="submit">Register</button>
        <p className="signup-link">Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  );
};

export default Register;
