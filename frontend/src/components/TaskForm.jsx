"use client";

import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/config";
import PropTypes from "prop-types";

export default function TaskForm({
  projectId,
  addTaskToProject, // callback from dashboard to add task in frontend
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      alert("Task title is required");
      return;
    }

    setLoading(true);
    try {
      await axios
        .put(`${API_BASE_URL}/api/projects/${projectId}/tasks`, {
          title,
          status: "To Do", // default status
        })
        .then((response) => {
          // Call the callback function to update the UI
          console.log("Task added successfully:", response.data);
          addTaskToProject(projectId, response.data);

          setTitle(""); // Clear the input field after adding the task
        });
      //if the task is added successfully, we call the callback to update the UI
    } catch (err) {
      console.error("Failed to add task", err);
      alert("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex space-x-2 max-w-md">
      <Input
        placeholder="New task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Task"}
      </Button>
    </form>
  );
}

TaskForm.propTypes = {
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  addTaskToProject: PropTypes.func.isRequired,
};
