import express from "express";
import ActualiteController from "../controllers/actualiteController";
import upload from "../middleware/uploadingImages";
// import uploadMiddleware from "../middleware/uploadingImages";

const event = new ActualiteController();
const router = express.Router();

router.get("/all", event.getAllActualite);

router.post("/create", upload.single("image"), event.createActuailte);

export default router;
