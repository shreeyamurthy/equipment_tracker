"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ScheduledTasks() {
    const { id, date } = useParams();
    const [tasks, setTasks] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (id && date) {
            fetch(`http://localhost:5000/maintenance/getDetailTasks/${id}/${date}`)
                .then(res => res.json())
                .then(data => setTasks(data));
        }
    }, [id, date]);

    return (
        <div className="min-h-screen p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">
                    Scheduled Maintenance for {date}
                </h1>
                <button 
                    onClick={() => router.push(`/equipment/${id}/calendar`)} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
                >
                    Back to Calendar
                </button>
            </div>
            <div className="flex flex-col items-center justify-center">
                {tasks.length > 0 ? (
                    <ul className="w-3/4">
                        {tasks.map((task, index) => (
                            <li key={index} className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
                                <p><strong>Task:</strong> {task.task}</p>
                                <p><strong>Description:</strong> {task.description}</p>
                                <p><strong>Status:</strong> {task.status}</p>
                                <p><strong>Technician:</strong> {task.technician_name}</p>
                                <p><strong>Technician Email:</strong> {task.email}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-lg text-gray-600 text-center">No tasks scheduled for this day.</p>
                )}
            </div>
        </div>
    );
}