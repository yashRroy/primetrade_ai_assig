import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Dashbord.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", notes: "" });
  const navigate = useNavigate();

  // ✅ Fetch tasks
  const fetchTasks = () => {
    fetch("http://localhost:8080/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Add Task
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      const data = await res.json();
      setTasks((prev) => [...prev, data]);
      setNewTask({ title: "", notes: "" });
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // ✅ Delete Task
  const handleDeleteTask = async (id) => {
    try {
      await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "DELETE",
      });
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // ✅ Update Task (toggle edit mode inline)
  const handleUpdateTask = async (id, updatedTask) => {
    try {
      const res = await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      const data = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // ✅ File Upload & Distribute
  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleDistributeList = () => {
    if (!csvFile) {
      alert("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    fetch("http://localhost:8080/tasks/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        alert("File uploaded successfully!");
        setCsvFile(null);
        fetchTasks();
      })
      .catch((err) => {
        console.error("Error uploading file:", err);
        alert("Failed to upload file. Try again.");
      });
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // if you’re storing JWT
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <header className="navbar">
        <h1>Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <main className="dashboard-main">
        {/* Add Task */}
        <section className="card">
          <h2>Add Task</h2>
          <form onSubmit={handleAddTask} className="form">
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
            <input
              type="text"
              name="notes"
              placeholder="Notes"
              value={newTask.notes}
              onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
              required
            />
            <button type="submit">Add Task</button>
          </form>
        </section>

        {/* Upload CSV */}
  

        {/* Tasks */}
        <section className="card">
          <h2>Task List</h2>
          {tasks.length === 0 ? (
            <p>No tasks available.</p>
          ) : (
            <ul>
              {tasks.map((task) => (
                <li key={task._id}>
                  <strong>{task.title}</strong>: {task.notes}
                  <div className="task-actions">
                    <button
                      onClick={() =>
                        handleUpdateTask(task._id, {
                          ...task,
                          notes: prompt("Update notes:", task.notes) || task.notes,
                        })
                      }
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeleteTask(task._id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
