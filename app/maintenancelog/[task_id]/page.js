"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function LogMaintenance() {
    const router = useRouter();
    const { task_id } = useParams();
    const id = 18; // Hardcoded technician ID
    const [maintenanceDate, setMaintenanceDate] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form with data:', {
            task_id: task_id,
            technician_id: id,
            maintenance_date: maintenanceDate,
            notes
            
        });
        try {
            await axios.post(`http://localhost:5000/maintenance/log`, {
                task_id: task_id,
                technician_id: id,
                maintenance_date: maintenanceDate,
                notes
               
            });
            router.push(`/tasks/${id}`);
        } catch (error) {
            console.error('Failed to log maintenance:', error);
        }
    };

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
                Log Maintenance
            </h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maintenanceDate">
                        Maintenance Date
                    </label>
                    <input 
                        type="date" 
                        id="maintenanceDate" 
                        value={maintenanceDate} 
                        onChange={(e) => setMaintenanceDate(e.target.value)} 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                        Notes
                    </label>
                    <textarea 
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)} 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required 
                    />
                </div>
               
                <div className="flex items-center justify-between">
                    <button 
                        type="submit" 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
                    >
                        Submit
                    </button>
                    <button 
                        type="button" 
                        onClick={() => router.push(`/tasks`)} 
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}