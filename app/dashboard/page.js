"use client";
import Navbar from '../../components/navbar';

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
        {/* Add your dashboard content here */}
      </div>
    </div>
  );
};

export default Dashboard;