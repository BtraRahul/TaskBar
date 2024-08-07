/* eslint-disable no-unused-vars */
"use client";

import { Fragment, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL } from "@/lib/config";
import { useUser } from "@clerk/clerk-react";
import { Progress } from "@/components/ui/progress";

export default function Component() {
  const [expandedProject, setExpandedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsProgress, setProjectsProgress] = useState({});
  const { user } = useUser();

  const fetchProjects = async () => {
    const email = user.primaryEmailAddress.emailAddress;
    setLoading(true);
    const res = await axios.get(`${API_BASE_URL}/api/projects/${email}`);
    const fetchedProjects = res.data;

    updateProgress(fetchedProjects);

    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const toggleExpand = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const deleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await axios.delete(`${API_BASE_URL}/api/projects/${projectId}`);
      fetchProjects();
      if (expandedProject === projectId) {
        setExpandedProject(null);
      }
    }
  };

  const deleteTask = async (projectId, taskId) => {
    const project = projects.find((project) => project._id === projectId);
    const updatedTasks = project.tasks.filter((task) => task._id !== taskId);
    await axios.put(`${API_BASE_URL}/api/projects/${projectId}`, {
      ...project,
      tasks: updatedTasks,
    });
    fetchProjects();
  };

  const updateProgress = async (fetchedProjects) => {
    const projectsWithCompletionCount = fetchedProjects.map((project) => {
      const completedCount = project.tasks.filter(
        (task) => task.status === "Completed"
      ).length;
      return { ...project, completedCount };
    });

    setProjects(projectsWithCompletionCount);
  };
  useEffect(() => {
    updateProgress(projects);
  }, []);

  // const updateTaskStatus = async (projectId, taskId, newStatus) => {
  //   const project = projects.find((project) => project._id === projectId);
  //   const updatedTasks = project.tasks.map((task) =>
  //     task._id === taskId ? { ...task, status: newStatus } : task
  //   );
  //   await axios.put(`${API_BASE_URL}/api/projects/${projectId}`, {
  //     ...project,
  //     tasks: updatedTasks,
  //   });
  //   fetchProjects();
  // };

  const updateTaskStatus = async (projectId, taskId, newStatus) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/projects/${projectId}/tasks/${taskId}/status`,
        { newStatus }
      );

      const updatedTask = res.data;

      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project._id === projectId) {
            const updatedTasks = project.tasks.map((task) =>
              task._id === taskId ? updatedTask : task
            );
            return { ...project, tasks: updatedTasks };
          }
          return project;
        })
      );
      fetchProjects();
    } catch (error) {
      console.error("Failed to update task status", error);
    }
  };

  return (
    <>
      <style>{`
        .expanding-container {
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }
        
        .collapsed {
          max-height: 0;
        }
        
        .expanded {
          max-height: 1000px; /* Set to a high enough value to accommodate content */
        }     
        
        `}</style>
      <Card className=" m-1 ">
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
                    <TableHead>
                      {/* <span className="sr-only">Delete</span> */}
                    </TableHead>
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
                        <TableCell className="font-medium ">
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
                              100
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteProject(project._id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedProject === project._id && (
                        <TableRow className="dark:bg-gray-900">
                          <TableCell colSpan={5}>
                            <div>
                              <div className="grid gap-4">
                                <div className="font-medium">Tasks</div>
                                <TaskForm
                                  projectId={project._id}
                                  fetchProjects={fetchProjects}
                                />
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Task</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <br />
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
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  updateTaskStatus(
                                                    project._id,
                                                    task._id,
                                                    "To Do"
                                                  )
                                                }
                                              >
                                                To Do
                                              </DropdownMenuItem>
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  updateTaskStatus(
                                                    project._id,
                                                    task._id,
                                                    "In Progress"
                                                  )
                                                }
                                              >
                                                In Progress
                                              </DropdownMenuItem>
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  updateTaskStatus(
                                                    project._id,
                                                    task._id,
                                                    "Completed"
                                                  )
                                                }
                                              >
                                                Completed
                                              </DropdownMenuItem>
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
                            </div>
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
