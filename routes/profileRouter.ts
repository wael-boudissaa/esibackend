import express from "express";
import profileController from "../controllers/profileController";

const router = express.Router();
const profile = new profileController();

router.get("/", profile.getAllUsers);
router.get("/:id", profile.getUserById);
router.post("/", profile.createUser);
router.put("/:id", profile.updateUser);
router.delete("/:id", profile.deleteUser);

export default router;
