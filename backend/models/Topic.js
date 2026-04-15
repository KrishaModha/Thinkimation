const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
    userId: String,
    topic_name: String,
    category: String,
    completion_level: String,
    hours_studied: { type: Number, default: 0 },
    videos_watched: { type: Number, default: 0 },
    notes_viewed: { type: Number, default: 0 },
    last_studied: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Topic", topicSchema);
