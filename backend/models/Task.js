const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },

  completed: {
    type: Boolean,
    default: false,
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },

  dueDate: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Task", TaskSchema);