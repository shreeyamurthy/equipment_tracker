"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

const Approvals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth/fetch-users');
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    }
  };

  const handleAction = async (userId, action) => {
    console.log(`Action: ${action}, User ID: ${userId}`); // Debugging log
    if (!action) {
      console.error('No action selected');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5000/auth/assign-role?employee_id=${userId}`, { action });
      if (response.status === 200) {
        alert('Action completed successfully');
        // Update the pending users list after action
        setPendingUsers(prevUsers => prevUsers.filter(user => user.employee_id !== userId));
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-3/4">
        <h1 className="text-2xl text-white font-bold mb-4">Pending Approvals</h1>
        <div className="space-y-4">
          {pendingUsers.map((user) => (
            <div key={user.id} className="p-4 rounded-lg shadow-md border border-gray-200" style={{ backgroundColor: 'oklch(0.869 0.022 252.894)'}}>
              <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
              <p className="text-gray-600 mb-1"><strong>Email:</strong> {user.email}</p>
              <p className="text-gray-600 mb-1"><strong>Employee ID:</strong> {user.employee_id}</p>
              <p className="text-gray-600 mb-1"><strong>Selected Role:</strong> {user.selected_role}</p>
              <p className="text-gray-600 mb-1"><strong>Assigned Role:</strong> {user.assigned_role}</p>
              <div className="mt-4">
                <label className="block text-gray-700 font-bold mb-2">Select Action</label>
                <select
                  onChange={(e) => handleAction(user.employee_id, e.target.value)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  <option value="">select value</option>
                  <option value="assign">Assign</option>
                  <option value="decline">Decline</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Approvals;
