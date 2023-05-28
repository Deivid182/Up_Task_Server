import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },

  deadline: {
    type: Date,
    default: Date.now()
  },
  priority: {
    type: String,
    required: true,
    enum: ["low", "medium", "high"]
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },

  managed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true 
})

const Task = mongoose.model("Task", taskSchema)

export default Task