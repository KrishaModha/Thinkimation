const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Study = require("./models/Study");
const Topic = require("./models/Topic");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log("Incoming:", req.method, req.url);
    next();
});

mongoose.connect("mongodb://127.0.0.1:27017/eduApp")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// ─── BASIC ────────────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
    res.send("Server is running");
});

// ─── AUTH ─────────────────────────────────────────────────────────────────────

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.send("User saved in database");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await User.findOne({ email, password });
        if (foundUser) {
            res.json({ userId: foundUser._id });
        } else {
            res.json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

// ─── STUDY SESSIONS ───────────────────────────────────────────────────────────

app.post("/add-study", async (req, res) => {
    console.log("ADD STUDY HIT", req.body);
    try {
        const { userId, topic, duration } = req.body;
        const today = new Date().toISOString().split("T")[0];

        const newStudy = new Study({
            userId,
            topic,
            duration,
            date: today,
            completedAt: new Date()
        });
        await newStudy.save();

        res.json({ message: "Study session saved", session: newStudy });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.get("/get-study/:userId", async (req, res) => {
    try {
        const data = await Study.find({ userId: req.params.userId });

        const mapped = data.map(item => ({
            date: item.date,
            session_type: "study",
            duration_minutes: item.duration,
            subject: item.topic,
            completed_at: item.completedAt
        }));

        res.json(mapped);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.get("/total-hours/:userId", async (req, res) => {
    try {
        const data = await Study.find({ userId: req.params.userId });
        let totalMinutes = 0;
        data.forEach(item => { totalMinutes += item.duration; });
        const hours = (totalMinutes / 60).toFixed(2);
        res.send(`Total studied: ${hours} hours`);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// ─── TOPICS ───────────────────────────────────────────────────────────────────

// Get all topics for a user
app.get("/get-topics/:userId", async (req, res) => {
    try {
        const topics = await Topic.find({ userId: req.params.userId });
        res.json(topics);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// Add a new topic
app.post("/add-topic", async (req, res) => {
    try {
        const { userId, topic_name, category, completion_level } = req.body;

        if (!userId || !topic_name || !category || !completion_level) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newTopic = new Topic({
            userId,
            topic_name,
            category,
            completion_level,
            hours_studied: 0,
            videos_watched: 0,
            notes_viewed: 0,
            last_studied: new Date(),
            created_at: new Date()
        });

        await newTopic.save();
        res.json({ message: "Topic added", topic: newTopic });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// Update topic progress
app.put("/update-topic/:topicId", async (req, res) => {
    try {
        const { hours_studied, videos_watched, notes_viewed } = req.body;

        const topic = await Topic.findById(req.params.topicId);
        if (!topic) return res.status(404).json({ message: "Topic not found" });

        topic.hours_studied += parseFloat(hours_studied) || 0;
        topic.videos_watched += parseInt(videos_watched) || 0;
        topic.notes_viewed += parseInt(notes_viewed) || 0;
        topic.last_studied = new Date();

        await topic.save();
        res.json({ message: "Topic updated", topic });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// Delete a topic
app.delete("/delete-topic/:topicId", async (req, res) => {
    try {
        await Topic.findByIdAndDelete(req.params.topicId);
        res.json({ message: "Topic deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// ─── START ────────────────────────────────────────────────────────────────────

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
