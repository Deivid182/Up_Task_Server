import express from "express";
import {
  authenticate,
  checkToken,
  confirm,
  forgotPassword,
  newPassword,
  newUser,
  profile,
  updatePassword,
  updateProfile,
} from "../controllers/userController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/", newUser);
router.post("/login", authenticate);
router.get("/confirm/:token", confirm);
router.post("/forgot-password", forgotPassword);
router.get("/forgot-password/:token", checkToken);
router.post("/forgot-password/:token", newPassword);
router.put("/profile/:id", checkAuth, updateProfile);
router.put("/change-password", checkAuth, updatePassword)

router.get("/profile", checkAuth, profile);

export default router;
