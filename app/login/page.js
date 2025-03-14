'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
        const response = await axios.post('http://localhost:5000/auth/login', formData);
        setSuccess(response.data.message || 'Login successful!');
        toast(response.data.message || 'Login successful!');
    
        // Handle the token and role as needed
        const { token, role } = response.data;
        console.log('Token:', token);
        console.log('Role:', role);
    
        // You can store the token in localStorage or a context for later use
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
    
        // Redirect or perform any other actions as needed
      } catch (err) {
        setError(err.response.data.message || 'An error occurred');
        toast(err.response.data.message || 'An error occurred');
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" >
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl p-8">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img src="/equipment_logo.png" alt="Login" className="w-full h-auto" />
        </div>
        <div className="md:w-1/2 md:ml-16 bg-white p-8 rounded-lg shadow-md" style={{ backgroundColor: 'oklch(0.985 0.001 106.423)'}}>
          <h2 className="text-2xl font-bold mb-6 text-center" >Login</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-black">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-black">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded transform transition-transform duration-200 hover:scale-105"
              style={{ backgroundColor: 'oklch(0.685 0.169 237.323)', color: '#FFFFFF' }}
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center">
            Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;