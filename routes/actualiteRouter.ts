import express from "express";
import ActualiteController from "../controllers/actualiteController";
import upload from "../middleware/uploadingImages";
import uploadMiddleware from "../middleware/uploadingImages";

const actualite = new ActualiteController();
const router = express.Router();

router.get("/all", actualite.getAllActualite);
router.get("/all/accepted", actualite.getAllActualiteAccepted);
router.get("/all/pending", actualite.getAllActualitePending);

router.get("/:idActualite", actualite.getActualiteById);
router.delete("/delete", actualite.DeleteActualite);
router.post("/create", upload.single("image"), actualite.createActuailte);
router.get("/t/types", actualite.getAlllTypes);
router.get("/user/:id", actualite.getActualiteByUser);

router.put("/update", upload.single("image"), actualite.ValidateActualite);

export default router;
