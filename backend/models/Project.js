import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // deadline: { type: Date },
  status: { type: String, default: "To Do" },
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  tasks: [taskSchema],
  deadline: { type: Date },
  email: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
