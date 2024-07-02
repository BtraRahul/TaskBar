/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_BASE_URL } from "@/lib/config";
import { useUser } from "@clerk/clerk-react";

const ProjectForm = ({ fetchProjects }) => {
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectDeadline, setNewProjectDeadline] = useState("");

  const { user } = useUser();
  const [newProjectEmail, setNewProjectEmail] = useState(
    user.primaryEmailAddress.emailAddress
  );

  const addNewProject = async (e) => {
    e.preventDefault();
    if (newProjectName.trim() !== "" && newProjectDescription.trim() !== "") {
      const newProject = {
        name: newProjectName,
        description: newProjectDescription,
        deadline: new Date(newProjectDeadline),
        email: newProjectEmail,
        tasks: [],
      };
      await axios.post(`${API_BASE_URL}/api/projects`, newProject);
      setNewProjectName("");
      setNewProjectDescription("");
      setNewProjectDeadline("");
      fetchProjects();
    }
  };

  return (
    <div className="mb-4 flex flex-col items-center gap-2 md:flex-row">
      <Input
        type="text"
        placeholder="New Project Name"
        value={newProjectName}
        onChange={(e) => setNewProjectName(e.target.value)}
        className="w-full md:w-auto"
      />
      <Input
        type="text"
        placeholder="New Project Description"
        value={newProjectDescription}
        onChange={(e) => setNewProjectDescription(e.target.value)}
        className="w-full md:w-auto"
      />
      <Input
        type="datetime-local"
        placeholder="Deadline"
        className="dark:[color-scheme:dark] w-full md:w-auto"
        value={newProjectDeadline}
        onChange={(e) => setNewProjectDeadline(e.target.value)}
      />
      <Button onClick={addNewProject} className="w-full md:w-auto">
        Add Project
      </Button>
    </div>
  );
};

export default ProjectForm;
