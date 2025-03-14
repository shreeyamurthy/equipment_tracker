"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

export default function ScheduledTasksCalendar() {
    const router = useRouter();
    const [events, setEvents] = useState([]);
    const id = 18; // Hardcoded technician ID

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/maintenance/getTaskCalendar/${id}`);
                const data = response.data;
                const formattedEvents = data.map(item => ({
                    title: item.task, // Display the task name
                    start: item.scheduled_date,
                    className: "maintenance-dot",
                    backgroundColor: "#007BFF",
                    borderColor: "#007BFF",
                    textColor: "#FFFFFF",
                    maintenanceDate: item.scheduled_date,
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Error fetching maintenance schedules:', error);
            }
        };

        fetchTasks();
    }, [id]);

    const handleDateClick = (selectionInfo) => {
        router.push(`/tasks/calendar/${id}/${selectionInfo.startStr}`);
    };

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
                Scheduled Maintenance Calendar
            </h1>
            <div className="p-6 rounded-lg shadow-lg">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    selectable={true}
                    select={handleDateClick}
                    headerToolbar={{
                        left: "today",
                        center: "title",
                        right: "prev,next",
                    }}
                    buttonText={{
                        today: "Today",
                    }}
                    themeSystem="standard"
                    height="auto"
                    contentHeight="auto"
                    aspectRatio={1.5}
                    dayHeaderClassNames="text-black"
                    eventContent={(eventInfo) => (
                        <div className="custom-event">
                            <span className="event-dot" style={{ backgroundColor: eventInfo.event.backgroundColor }}></span>
                        </div>
                    )}
                />
            </div>
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => router.push(`/tasks`)}
                    className="px-6 py-3 text-lg font-semibold text-white rounded-lg shadow-md"
                    style={{ backgroundColor: "oklch(0.685 0.169 237.323)" }}
                >
                    Back to Tasks
                </button>
            </div>
        </div>
    );
}