'use client'
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../../components/navbar';

const EquipmentDetail = ({ params }) => {
  const { id } = use(params);
  const router = useRouter();
  console.log(id);
  const [equipment, setEquipment] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchEquipmentDetail = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/equipment//fetchEquipmentDetail/${id}`);
          console.log(response.data);
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

  const handleViewCalendar = () => {
    router.push(`/equipment/${id}/calendar`);
  };

  const handleViewMaintenanceClick = () => {
    router.push(`/equipment/maintenance/${id}`);
};

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8 w-3/4 text-white">
        <h1 className="text-3xl font-bold mb-6">{equipment.name}</h1>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-lg mb-1"><strong>Type:</strong> {equipment.type}</p>
          <p className="text-lg mb-1"><strong>Serial Number:</strong> {equipment.serial_number}</p>
          <p className="text-lg mb-1"><strong>Location:</strong> {equipment.location}</p>
          <p className="text-lg mb-1"><strong>Purchase Date:</strong> {equipment.purchase_date}</p>
          <p className="text-lg mb-1"><strong>Entry Date:</strong> {equipment.entry_date}</p>
        </div>
        <div className="flex justify-between mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            View Past Logs
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          onClick={handleViewMaintenanceClick}>
            View Maintenance
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleViewCalendar}
          >
            View Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;