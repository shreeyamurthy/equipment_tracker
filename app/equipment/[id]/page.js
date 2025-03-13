'use client'
import {use, useState, useEffect } from 'react';

import axios from 'axios';
import Navbar from '../../../components/navbar';

const EquipmentDetail = ({params}) => {
  
  const { id } = use(params);
  console.log(id);
  const [equipment, setEquipment] = useState(null);


  useEffect(() => {
    
    if (id) {
      const fetchEquipmentDetail = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/equipment/${id}`);
          setEquipment(response.data);
        } catch (error) {
          console.error('Error fetching equipment details:', error);
        }
      };
      fetchEquipmentDetail();
    }
  }, [id]);

  if (!equipment) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8 w-3/4">
        <h1 className="text-2xl font-bold mb-4">{equipment.name}</h1>
        <p className="text-gray-600 mb-1"><strong>Type:</strong> {equipment.type}</p>
        <p className="text-gray-600 mb-1"><strong>Serial Number:</strong> {equipment.serial_number}</p>
        <p className="text-gray-600 mb-1"><strong>Location:</strong> {equipment.location}</p>
        <p className="text-gray-600 mb-1"><strong>Purchase Date:</strong> {equipment.purchase_date}</p>
        <p className="text-gray-600 mb-1"><strong>Entry Date:</strong> {equipment.entry_date}</p>
        <div className="flex justify-between mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            View Past Logs
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Edit Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;