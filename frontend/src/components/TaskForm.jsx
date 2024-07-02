/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/config";


const TaskForm = ({ projectId, fetchProjects }) => {
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setnewTaskDescription] = useState("");

  const addNewTask = async (e) => {
    if (newTaskName.trim() !== "") {
      // e.preventDefault();
      const newTask = { title: newTaskName, description: newTaskDescription };
      await axios.put(
        `${API_BASE_URL}/api/projects/${projectId}/tasks`,
        newTask
      );
      fetchProjects();
      setNewTaskName("");
      setnewTaskDescription("");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        className="ml-1"
        type="text"
        placeholder="Add new task"
        value={newTaskName}
        onChange={(e) => setNewTaskName(e.target.value)}
      />
      <Button className="mr-10" onClick={() => addNewTask()}>
        Add
      </Button>
    </div>
  );
};

export default TaskForm;
