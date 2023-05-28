import express, { Router } from "express"
import {
  getProjects,
  newProject,
  getProject,
  editProject,
  deleteProject,
  addMember,
  deleteMember,
  getMember
} from "../controllers/projectController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router()

router.get("/", checkAuth, getProjects)
router.post("/", checkAuth, newProject)

router.get("/:id", checkAuth, getProject)
router.put("/:id", checkAuth, editProject)
router.delete("/:id", checkAuth, deleteProject)


router.post("/members", checkAuth, getMember)
router.post("/members/:id", checkAuth, addMember)
router.post("/delete-member/:id", checkAuth, deleteMember)

export default router
