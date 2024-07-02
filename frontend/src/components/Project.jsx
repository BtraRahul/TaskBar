/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import Task from "./Task";
import { API_BASE_URL } from "@/lib/config";


const Project = ({ project, fetchProjects }) => {
  const [showTaskForm, setShowTaskForm] = useState(false);

  const deleteProject = async () => {
    await axios.delete(`${API_BASE_URL}/api/projects/${project._id}`);
    fetchProjects();
  };

  const toggleTaskCompletion = async (taskId, completed) => {
    const updatedTasks = project.tasks.map((task) =>
      task._id === taskId ? { ...task, completed } : task
    );
    await axios.put(`${API_BASE_URL}/api/projects/${project._id}`, {
      ...project,
      tasks: updatedTasks,
    });
    fetchProjects();
  };

  const deleteTask = async (taskId) => {
    const updatedTasks = project.tasks.filter((task) => task._id !== taskId);
    await axios.put(`${API_BASE_URL}/api/projects/${project._id}`, {
      ...project,
      tasks: updatedTasks,
    });
    fetchProjects();
  };

  return (
    <div>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <button onClick={() => setShowTaskForm(!showTaskForm)}>
        {showTaskForm ? "Cancel" : "Add Task"}
      </button>
      <button onClick={deleteProject}>Delete Project</button>
      {showTaskForm && (
        <TaskForm projectId={project._id} fetchProjects={fetchProjects} />
      )}
      <ul>
        {project.tasks.map((task) => (
          <Task
            key={task._id}
            task={task}
            toggleTaskCompletion={toggleTaskCompletion}
            deleteTask={deleteTask}
          />
        ))}
      </ul>
    </div>
  );
};

export default Project;
