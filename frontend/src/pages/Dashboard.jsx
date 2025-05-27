"use client";

import { Fragment, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import axios from "axios";
import ProjectForm from "@/components/ProjectForm";
import TaskForm from "@/components/TaskForm";
import { API_BASE_URL } from "@/lib/config";
import { useUser } from "@clerk/clerk-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardContent, Skeleton } from "@mui/material";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [expandedProject, setExpandedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  // Fetch all projects for user
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const email = user.primaryEmailAddress.emailAddress;
      const res = await axios.get(`${API_BASE_URL}/api/projects/${email}`);

      // Add completedCount for progress bar
      const fetched = res.data.map((p) => ({
        ...p,
        completedCount: p.tasks.filter((t) => t.status === "Completed").length,
      }));
      setProjects(fetched);
    } catch (err) {
      console.error("Error fetching projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  // Toggle expand tasks view for project
  const toggleExpand = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  // Delete a project locally and backend
  const deleteProject = async (projectId) => {
    if (!window.confirm("Delete this project?")) return;

    // Update UI immediately
    setProjects((prev) => prev.filter((p) => p._id !== projectId));
    if (expandedProject === projectId) setExpandedProject(null);

    // Delete in backend
    try {
      await axios.delete(`${API_BASE_URL}/api/projects/${projectId}`);
    } catch (err) {
      console.error("Failed to delete project", err);
      // Optionally re-fetch projects or revert UI if needed
    }
  };

  // Delete a task locally and backend
  const deleteTask = async (projectId, taskId) => {
    // setProjects((prev) =>
    //   prev.map((p) => {
    //     if (p._id === projectId) {
    //       const newTasks = p.tasks.filter((t) => t._id !== taskId);
    //       return {
    //         ...p,
    //         tasks: newTasks,
    //         completedCount: newTasks.filter((t) => t.status === "Completed")
    //           .length,
    //       };
    //     }
    //     return p;
    //   })
    // );

    const project = projects.find((project) => project._id === projectId);
    const updatedTasks = project.tasks.filter((task) => task._id !== taskId);
    console.log("Deleting task", taskId, "from project", projectId);
    try {
      await axios
        .put(`${API_BASE_URL}/api/projects/${projectId}`, {
          ...project,
          tasks: updatedTasks,
        })
        .then((response) => {
          console.log("Task deleted successfully:", response.data);
          setProjects((res) =>
            res.map((p) => {
              if (p._id === projectId) {
                return {
                  ...p,
                  tasks: updatedTasks,
                  completedCount: updatedTasks.filter(
                    (t) => t.status === "Completed"
                  ).length,
                };
              }
              return p;
            })
          );
        });
    } catch (err) {
      console.error("Failed to delete task", err);
      // Optionally re-fetch projects or revert UI
    }
  };

  // Update task status locally and backend
  const updateTaskStatus = async (projectId, taskId, newStatus) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p._id === projectId) {
          const updatedTasks = p.tasks.map((t) =>
            t._id === taskId ? { ...t, status: newStatus } : t
          );
          return {
            ...p,
            tasks: updatedTasks,
            completedCount: updatedTasks.filter((t) => t.status === "Completed")
              .length,
          };
        }
        return p;
      })
    );

    try {
      await axios.put(
        `${API_BASE_URL}/api/projects/${projectId}/tasks/${taskId}/status`,
        {
          newStatus,
        }
      );
    } catch (err) {
      console.error("Failed to update task status", err);
      // Optionally re-fetch projects or revert UI
    }
  };

  // Add new task callback — updates project inside projects array
  const addTaskToProject = (projectId, createdTask) => {
    console.log("Adding task to project", projectId, createdTask);
    setProjects((prev) =>
      prev.map((p) => {
        if (p._id === projectId) {
          return createdTask;
        }
        return p;
      })
    );

    console.log("Task added to project", projectId, createdTask);
  };

  return (
    <Card className="m-1">
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>
          View and manage your projects and tasks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          <>
            <ProjectForm fetchProjects={fetchProjects} />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Tasks</TableHead>
                  <TableHead className="text-red-500">Deadline</TableHead>
                  <TableHead className="text-green-500">Progress</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <Fragment key={project._id}>
                    <TableRow
                      onClick={() => toggleExpand(project._id)}
                      className={`cursor-pointer ${
                        expandedProject === project._id ? "bg-muted" : ""
                      }`}
                    >
                      <TableCell className="font-medium">
                        {project.name}
                      </TableCell>
                      <TableCell>{project.description}</TableCell>
                      <TableCell>{project.tasks.length}</TableCell>
                      <TableCell>
                        {new Date(project.deadline).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Progress
                          value={
                            (project.completedCount / project.tasks.length) *
                              100 || 0
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProject(project._id);
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>

                    <AnimatePresence initial={false}>
                      {expandedProject === project._id && (
                        <TableRow className="bg-transparent">
                          <TableCell colSpan={6} className="p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="bg-background border border-border rounded-xl shadow-sm m-4 p-4">
                                <div className="font-medium text-lg mb-2">
                                  Tasks
                                </div>

                                {/* Pass addTaskToProject callback here */}
                                <TaskForm
                                  projectId={project._id}
                                  project={project}
                                  setProject={(updatedProject) => {
                                    setProjects((prev) =>
                                      prev.map((p) =>
                                        p._id === updatedProject._id
                                          ? updatedProject
                                          : p
                                      )
                                    );
                                  }}
                                  addTaskToProject={addTaskToProject}
                                />

                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Task</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {project.tasks.map((task) => (
                                      <TableRow key={task._id}>
                                        <TableCell>{task.title}</TableCell>
                                        <TableCell>
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                              >
                                                {task.status}
                                                <ChevronDownIcon className="ml-2 h-4 w-4 stroke-black dark:stroke-white duration-500" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                              {[
                                                "To Do",
                                                "In Progress",
                                                "Completed",
                                              ].map((status) => (
                                                <DropdownMenuItem
                                                  key={status}
                                                  onClick={() =>
                                                    updateTaskStatus(
                                                      project._id,
                                                      task._id,
                                                      status
                                                    )
                                                  }
                                                >
                                                  {status}
                                                </DropdownMenuItem>
                                              ))}
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </TableCell>
                                        <TableCell>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                              deleteTask(project._id, task._id)
                                            }
                                          >
                                            <TrashIcon className="h-4 w-4" />
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Icons needed for buttons
function TrashIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
