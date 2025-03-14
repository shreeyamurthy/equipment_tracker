"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

const MaintenancePage = () => {
    const router = useRouter();
    const { id } = useParams();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        task: "",
        year: 0,
        month: 0,
        day: 0,
        description: "",
    });
    const [technicianName, setTechnicianName] = useState("");
    const [editableTask, setEditableTask] = useState({});
    const [isEditingTech, setisEditingTech] = useState(false);
    const [editableNameTech, seteditableNameTech] = useState({ technician_name: technicianName, technician_id: '' });
    const [product, setProduct] = useState({});

    useEffect(() => {
        const fetchMaintenanceTasks = async () => {
            if (!id) return;
            try {
                const response = await fetch(
                    `http://localhost:5000/equipment/fetchMaintenanceTasks/${id}`
                );
                if (!response.ok) throw new Error("Failed to fetch tasks");
                const data = await response.json();
                setTasks(data.map((task) => ({ ...task, editable: false })));

                const detailResponse = await fetch(
                    `http://localhost:5000/equipment/fetchEquipmentDetail/${id}`
                );
                if (!detailResponse.ok)
                    throw new Error("Failed to fetch equipment details");
                const detailData = await detailResponse.json();
                setProduct(detailData);
                seteditableNameTech({ technician_name: detailData.technician_name, technician_id: '' })
                setTechnicianName(detailData.technician_name);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchMaintenanceTasks();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({
            ...prev,
            [name]:
                name === "task" || name === "description"
                    ? value
                    : value === ""
                        ? ""
                        : parseInt(value),
        }));
    };

    const addMaintenanceTask = async () => {
        if (!newTask.task.trim() || !newTask.description.trim())
            return alert("Task and Description are required.");

        try {
            const response = await fetch(
                `http://localhost:5000/equipment/addMaintenanceTask`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, ...newTask }),
                }
            );

            if (!response.ok) throw new Error("Failed to add task");

            const addedTask = await response.json();
            setTasks((prev) => [...prev, { ...addedTask, editable: false }]);
            setNewTask({ task: "", year: 0, month: 0, day: 0, description: "" });
        } catch (error) {
            console.error("Error adding maintenance task:", error);
        }
    };

    const updateMaintenanceTask = async (taskId, updatedTask) => {
        try {
            const response = await fetch(
                `http://localhost:5000/equipment/updateMaintenanceTask/${taskId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedTask),
                }
            );

            if (!response.ok) throw new Error("Failed to update task");

            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId
                        ? { ...task, ...updatedTask, editable: false }
                        : task
                )
            );
        } catch (error) {
            console.error("Error updating maintenance task:", error);
        }
    };

    const deleteMaintenanceTask = async (taskId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/equipment/deleteMaintenanceTask/${taskId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) throw new Error("Failed to delete task");

            setTasks((prev) => prev.filter((task) => task.id !== taskId));
        } catch (error) {
            console.error("Error deleting maintenance task:", error);
        }
    };

    const handleEdit = (taskId, task) => {
        setEditableTask(task);
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId ? { ...task, editable: !task.editable } : task
            )
        );
    };

    const handleTaskChange = (taskId, name, value) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        [name]:
                            name === "task" || name === "description"
                                ? value
                                : value === ""
                                    ? ""
                                    : parseInt(value),
                    }
                    : task
            )
        );
    };

    const cancelEdit = (taskId) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId ? { ...editableTask, editable: false } : task
            )
        );
    };

    const formatFrequency = (year, month, day) => {
        const parts = [];
        if (year) parts.push(`${year} year${year > 1 ? "s" : ""}`);
        if (month) parts.push(`${month} month${month > 1 ? "s" : ""}`);
        if (day) parts.push(`${day} day${day > 1 ? "s" : ""}`);
        return parts.join(", ") || "Not specified";
    };

    const handleEditClickTech = () => {
        setisEditingTech(true);
    };

    const handleCancelClickTech = () => {
        seteditableNameTech({ technician_name: technicianName, technician_id: '' }); // Reset to original name
        setisEditingTech(false);
    };

    const handleSaveClickTech = async () => {

        try {
            const response = await fetch(
                `http://localhost:5000/equipment/editAssignee/`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 'technician_id': editableNameTech.technician_id, 'equipment_id': product.id, 'technician_name': editableNameTech.technician_name }),
                }
            );

            if (!response.ok) throw new Error("Failed to update task");

        } catch (error) {
            console.error("Error updating maintenance task:", error);
        }
        setisEditingTech(false);
        setTechnicianName(editableNameTech.technician_name);
    };

    const handleGenerateClickTech = async () => {

        try {
            const response = await fetch(
                `http://localhost:5000/equipment/autoAssignAssignee`
            );
            if (!response.ok) throw new Error("Failed to fetch Assignee");
            const data = await response.json();
            seteditableNameTech({ technician_name: data.technician_name, technician_id: data.technician_id })
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleBackClick = () => {
        router.push(`/equipment/${id}`);
    };

    

    return (
        <div className="max-w-5xl mx-auto p-8 space-y-12">
            <div className="flex justify-end">
                <button className="mt-1 px-2 py-2 bg-indigo-600 text-white text-lg rounded-xl hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500"
                onClick={handleBackClick}
                >
                    Back to Equipment
                </button>
            </div>
            <div className="text-center mb-12 relative">

                <h1 className="text-6xl font-extrabold text-indigo-700">
                    Maintenance Schedule
                </h1>
                <div className="text-xl text-gray-600 mt-4 flex justify-center items-center">
                    <p className="text-xl text-gray-600 mt-4">
                        {product.name} -{" "}
                        {isEditingTech ? (
                            <span className=" inline border-b-2 border-indigo-500 focus:outline-none"> {editableNameTech.technician_name} </span>
                        ) : (
                            <span
                                className="underline cursor-pointer"
                                onClick={handleEditClickTech}
                            >
                                {technicianName}
                            </span>
                        )}
                    </p>

                    {isEditingTech && (
                        <div className="flex items-center ml-4">
                            <button
                                className="px-2 py-1 mt-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                                onClick={handleSaveClickTech}
                            >
                                Save
                            </button>
                            <button
                                className="ml-2 px-2 py-1 mt-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-300"
                                onClick={handleGenerateClickTech}
                            >
                                Generate
                            </button>
                            <button
                                className="ml-2 px-2 py-1 mt-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                                onClick={handleCancelClickTech}
                            >
                                Cancel
                            </button>

                        </div>
                    )}
                </div>
            </div>

            {/* Display Tasks Section */}
            <div className="bg-gradient-to-br from-white to-gray-100 shadow-xl rounded-3xl p-8 ">

                <h2 className="text-3xl font-bold text-indigo-600 mb-8">
                    Scheduled Maintenance Tasks
                </h2>

                {tasks.length > 0 ? (
                    <div className="space-y-8">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="p-6 bg-white shadow-lg rounded-xl border-l-8 border-indigo-500"
                            >
                                {task.editable ? (
                                    <>
                                        <input
                                            value={task.task}
                                            onChange={(e) =>
                                                handleTaskChange(task.id, "task", e.target.value)
                                            }
                                            className="w-full text-2xl font-semibold text-gray-800 border rounded-md p-2"
                                        />
                                        <textarea
                                            value={task.description}
                                            onChange={(e) =>
                                                handleTaskChange(task.id, "description", e.target.value)
                                            }
                                            className="w-full text-gray-500 border rounded-md p-2 mt-2"
                                        />

                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            <input
                                                type="number"
                                                value={task.year}
                                                onChange={(e) =>
                                                    handleTaskChange(task.id, "year", e.target.value)
                                                }
                                                placeholder="Year"
                                                className="p-2 border rounded-md"
                                            />
                                            <input
                                                type="number"
                                                value={task.month}
                                                onChange={(e) =>
                                                    handleTaskChange(task.id, "month", e.target.value)
                                                }
                                                placeholder="Month"
                                                className="p-2 border rounded-md"
                                            />
                                            <input
                                                type="number"
                                                value={task.day}
                                                onChange={(e) =>
                                                    handleTaskChange(task.id, "day", e.target.value)
                                                }
                                                placeholder="Day"
                                                className="p-2 border rounded-md"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-2xl font-semibold text-gray-800">
                                            {task.task}
                                        </h3>
                                        <p className="text-gray-600 mt-2">
                                            Frequency:{" "}
                                            {formatFrequency(task.year, task.month, task.day)}
                                        </p>
                                        <p className="mt-4 text-gray-500">{task.description}</p>
                                    </>
                                )}

                                <div className="mt-4 flex space-x-4">
                                    {task.editable ? (
                                        <>
                                            <button
                                                onClick={() => updateMaintenanceTask(task.id, task)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => cancelEdit(task.id)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(task.id, task)}
                                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteMaintenanceTask(task.id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        No maintenance tasks available.
                    </p>
                )}
            </div>
            <div className="bg-white shadow-2xl rounded-3xl p-8">
                <h2 className="text-3xl font-bold text-indigo-700 mb-8">
                    Add New Maintenance Task
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Task Name
                        </label>
                        <input
                            name="task"
                            placeholder="Task Name"
                            value={newTask.task}
                            onChange={handleInputChange}
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Year
                        </label>
                        <input
                            name="year"
                            type="number"
                            placeholder="Year"
                            value={newTask.year}
                            onChange={handleInputChange}
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Month
                        </label>
                        <input
                            name="month"
                            type="number"
                            placeholder="Month"
                            value={newTask.month}
                            onChange={handleInputChange}
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Day
                        </label>
                        <input
                            name="day"
                            type="number"
                            placeholder="Day"
                            value={newTask.day}
                            onChange={handleInputChange}
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                            min="0"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Description
                        </label>
                        <input
                            name="description"
                            placeholder="Description"
                            value={newTask.description}
                            onChange={handleInputChange}
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <button
                    onClick={addMaintenanceTask}
                    className="mt-8 px-8 py-4 bg-indigo-600 text-white text-lg rounded-xl hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500"
                >
                    Add Task
                </button>
            </div>
        </div>
    );
};

export default MaintenancePage;