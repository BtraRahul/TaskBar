"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/clerk-react";
import { API_BASE_URL } from "@/lib/config";

export default function ProjectForm({ fetchProjects }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !deadline) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/projects`, {
        name,
        description,
        deadline,
        email: user.emailAddresses[0].emailAddress, // you can remove this if backend uses Clerk
      });

      setName("");
      setDescription("");
      setDeadline("");

      fetchProjects();
    } catch (err) {
      console.error("Failed to create project", err);
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-2 max-w-4xl">
      <h2 className="text-lg font-semibold">Create New Project</h2>
      <div className="mb-4 flex flex-col items-center gap-2 md:flex-row">
        <Input
          type="text"
          placeholder="New Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full md:w-auto"
          disabled={loading}
        />
        <Input
          type="text"
          placeholder="New Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full md:w-auto"
          disabled={loading}
        />
        <label htmlFor="deadline" className="sr-only">
          Deadline
        </label>
        <Input
          type="datetime-local"
          id="deadline"
          className="dark:[color-scheme:dark] w-full md:w-auto"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" className="w-full md:w-auto" disabled={loading}>
          {loading ? "Creating..." : "Add Project"}
        </Button>
      </div>
    </form>
  );
}

ProjectForm.propTypes = {
  fetchProjects: PropTypes.func.isRequired,
};
