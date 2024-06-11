import express from "express";
import EventController from "../controllers/eventController";
import upload from "../middleware/uploadingImages";

const router = express.Router();
const eventController = new EventController();

router.get("/all", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.get("/t/type", eventController.getEvenetByIdType);

router.post("/create", upload.single("image"), eventController.createEvent);
router.put("/validate", eventController.validateEvent);
router.delete("/delete/:id", eventController.deleteEvent);
router.get("/s/search", eventController.searchEventsByName);

export default router;
