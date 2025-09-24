const router = require("express").Router();
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const Task = require("../model/Task");

const upload = multer({ dest: "uploads/" });

// Upload CSV (bulk add tasks)
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        let tasks = [];

        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on("data", (row) => {
                tasks.push({
                    title: row.Title || "Untitled Task",
                    notes: row.Notes || "",
                });
            })
            .on("end", async () => {
                const savedTasks = await Task.insertMany(tasks);
                fs.unlinkSync(req.file.path); // delete uploaded file
                res.json({ message: "Tasks uploaded successfully", tasks: savedTasks });
            });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Task
router.post("/", async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all Tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Task
router.put("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete Task
router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
