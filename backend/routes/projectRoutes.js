import express from "express";
import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addTaskToProject,
  fetchByEmail
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


export default router;
