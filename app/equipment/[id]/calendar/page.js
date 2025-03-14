"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

export default function EquipmentCalendar({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/maintenance/getScheduledMaintenance/${id}`)
                .then(response => {
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
                    console.log(formattedEvents); // Check the events
                    setEvents(formattedEvents);
                })
                .catch(error => {
                    console.error('Error fetching maintenance schedules:', error);
                });
        }
    }, [id]);

    const handleDateClick = (selectionInfo) => {
        console.log("entered handle date click");
        console.log(`infodate:${selectionInfo.startStr}`);
        router.push(`/equipment/${id}/calendar/${selectionInfo.startStr}`);
    };

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-4xl font-bold text-center mb-8">
                Maintenance Calendar for Equipment {id}
            </h1>
            <div className="p-6 rounded-lg shadow-lg">
                <FullCalendar
                    plugins={[dayGridPlugin,interactionPlugin]}
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
                    onClick={() => router.push(`/equipment/${id}`)}
                    className="px-6 py-3 text-lg font-semibold text-white rounded-lg shadow-md"
                    style={{ backgroundColor: "oklch(0.685 0.169 237.323)" }}
                >
                    Back to Equipment
                </button>
            </div>
        </div>
    );
}