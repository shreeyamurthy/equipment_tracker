"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
import { useRouter } from 'next/navigation';

const Equipment = () => {
    const [equipment, setEquipment] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const router = useRouter();
  
    const fetchEquipment = async (type) => {
      try {
        const response = await axios.get('http://localhost:5000/equipment/fetchEquipment', {
          params: { type }
        });
        setEquipment(response.data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }
    };
  
    useEffect(() => {
      fetchEquipment(selectedType);
    }, [selectedType]);

    const handleCardClick = (id) => {
        router.push(`/equipment/${id}`);
      };
  
    const handleScheduleMaintenance = (id) => {
      // Handle the schedule maintenance action here
      console.log(`Schedule maintenance for equipment ID: ${id}`);
    };
  
    return (
      <div>
        <Navbar />
        <div className="container mx-auto mt-8">
          <div className="flex justify-center mb-4 space-x-4">
            <label className="block text-white font-bold mb-2">Select Equipment Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-black px-4 py-2 rounded hover:bg-blue-600"  style={{ backgroundColor: 'oklch(0.869 0.022 252.894)'}}
            >
              <option value="">All</option>
              <option value="Laptop">Laptop</option>
              <option value="Monitor">Monitor</option>
              <option value="Mouse">Mouse</option>
              <option value="Keyboard">Keyboard</option>
            </select>
          </div>
          <div className="w-3/4 mx-auto space-y-4">
            {equipment.map((item) => (
              <div key={item.id} 
                className="relative p-4 rounded-lg shadow-md border border-gray-200 transform transition-transform duration-200 hover:scale-105"
                onClick={() => handleCardClick(item.id)} style={{ backgroundColor: 'oklch(0.869 0.022 252.894)'}}>
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="text-gray-600 mb-1"><strong>Type:</strong> {item.type}</p>
                <p className="text-gray-600 mb-1"><strong>Serial Number:</strong> {item.serial_number}</p>
                {/* <p className="text-gray-600 mb-1"><strong>Location:</strong> {item.location}</p>
                <p className="text-gray-600 mb-1"><strong>Purchase Date:</strong> {item.purchase_date}</p>
                <p className="text-gray-600 mb-1"><strong>Entry Date:</strong> {item.entry_date}</p> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  

export default Equipment;