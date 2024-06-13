import express from "express";
import ActualiteController from "../controllers/actualiteController";
import upload from "../middleware/uploadingImages";
// import uploadMiddleware from "../middleware/uploadingImages";

const actualite = new ActualiteController();
const router = express.Router();

router.get("/all", actualite.getAllActualite);
router.get("/:idActualite", actualite.getActualiteById);
router.delete("/delete", actualite.DeleteActualite);
router.post("/create", upload.single("image"), actualite.createActuailte);
router.post("/t/types", actualite.getAlllTypes);

router.put("/update", upload.single("image"), actualite.ValidateActualite);

export default router;
