const mongoose = require("mongoose");

const studySchema = new mongoose.Schema({
    userId: String,
    topic: String,
    duration: Number,
    date: String,              // "YYYY-MM-DD" for easy frontend filtering
    completedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Study", studySchema);
