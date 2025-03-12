"use client";
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();

  const handleLogoutClick = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logged out');
  };

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  const handleApprovalsClick = () => {
    router.push('/roleApprovals');
  };

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center shadow-sm border-b border-gray-200">
      <div className="flex items-center">
        <img src="/equipment_logo.png" alt="Logo" className="h-8 w-8 mr-2" />
        
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={handleDashboardClick} className="text-black">Dashboard</button>
        <button onClick={handleApprovalsClick} className="text-black">Approvals</button>
        <button onClick={() => router.push('/equipment')} className="text-black">Equipment</button>
      </div>
      <div className="relative">
        <FaUserCircle className="text-black text-2xl cursor-pointer" onClick={handleLogoutClick} />
        {showLogout && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;