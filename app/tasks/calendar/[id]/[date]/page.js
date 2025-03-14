"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function EquipmentTasks() {
    const [tasks, setTasks] = useState([]);
    const { id, date } = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/maintenance/getDateTasks/${id}/${date}`);
                setTasks(response.data);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            }
        };

        fetchTasks();
    }, [id, date]);

    return (
        <div className="min-h-screen p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-blue-600">
                    Maintenance Tasks for {new Date(date).toLocaleDateString()}
                </h1>
                <button 
                    onClick={() => router.push(`/tasks/calendar`)} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
                >
                    Back to Calendar
                </button>
            </div>
            <div className="flex flex-col items-center justify-center">
                {tasks.length > 0 ? (
                    <ul className="w-3/4">
                        {tasks.map((task, index) => (
                            <li key={index} className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
                                <p className="text-xl font-semibold">{task.task}</p>
                                <p><strong>Description:</strong> {task.description}</p>
                                <p><strong>Status:</strong> {task.status}</p>
                                <p><strong>Scheduled Date:</strong> {new Date(task.scheduled_date).toLocaleDateString()}</p>
                                <p><strong>Equipment Name:</strong> {task.name}</p>
                                <p><strong>Equipment Type:</strong> {task.type}</p>
                                <p><strong>Serial Number:</strong> {task.serial_number}</p>
                                <p><strong>Manager Name:</strong> {task.manager_name}</p>
                                <p><strong>Manager Email:</strong> {task.manager_email}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-lg text-gray-600 text-center">No tasks are found.</p>
                )}
            </div>
        </div>
    );
}