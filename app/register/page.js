'use client';

import { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    email: '',
    password: '',
    selected_role: '',
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
      const response = await axios.post('http://localhost:5000/auth/register', formData);
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" >
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl p-8">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img src="/equipment_logo.png" alt="Register" className="w-full h-auto" />
        </div>
        <div className="md:w-1/2 md:ml-16 bg-white p-8 rounded-lg shadow-md" style={{ backgroundColor: 'oklch(0.869 0.022 252.894)'}}>
          <h2 className="text-2xl font-bold mb-6 text-center" >Register</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-black">Employee ID</label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-black">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
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
            <div className="mb-4">
              <label className="block text-black">Role</label>
              <select
                name="selected_role"
                value={formData.selected_role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Technician">Technician</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded transform transition-transform duration-200 hover:scale-105"
              style={{ backgroundColor: 'oklch(0.685 0.169 237.323)', color: '#FFFFFF' }}
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-center">
            Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;