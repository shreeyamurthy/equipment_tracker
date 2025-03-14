"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function AddEquipment() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    serial_number: '',
    location: '',
    purchase_date: '',
    manager_id: 23
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/equipment/createEquipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(`${result.message}`);
        // Redirect to the maintenance page for the newly added equipment
        router.push(`/equipment/maintenance/${result.id}`);
    } else {
        toast.error(`Failed to add equipment: ${result.error}`);
    }
    }
     catch (error) {
        toast("error adding eqiupment");
      console.error('Error adding equipment:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 p-4">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-3xl p-8">
        <h1 className="text-4xl font-extrabold text-blue-600 text-center mb-8">
          📋 Add New Equipment
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Type', name: 'type', type: 'text' },
            { label: 'Serial Number', name: 'serial_number', type: 'text' },
            { label: 'Location', name: 'location', type: 'text' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}

          {/* Date Picker - Click Anywhere to Open Calendar */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Purchase Date
            </label>
            <div
              className="relative w-full"
              onClick={() =>
                document.getElementById('purchase_date').showPicker()
              }
            >
              <input
                id="purchase_date"
                type="date"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-transform transform hover:scale-105"
          >
            Save and Continue ➡️
          </button>
        </form>
      </div>
    </div>
  );
}