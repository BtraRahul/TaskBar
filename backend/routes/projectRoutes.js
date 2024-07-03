import express from "express";
import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addTaskToProject,
  fetchByEmail,
  deleteTask,
  updateTaskStatus,
} from "../controllers/projectController.js";

const router = express.Router();

router.route("/").get(getProjects).post(createProject);

router.route(`/:email`).get(fetchByEmail);

router
  .route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

router.route("/:id/tasks").put(addTaskToProject);
router.route("/:projectId/tasks/:taskId/status").put(updateTaskStatus);
router.route("/:projectId/tasks/:taskId").delete(deleteTask);

export default router;
