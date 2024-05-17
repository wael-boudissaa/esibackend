import express from "express";
import EventController from "../controllers/eventController";

const router = express.Router();
const eventController = new EventController();

router.get("/all", eventController.getAllEvents);
// router.get("/:id", eventController.getEventById);
router.post("/create", eventController.createEvent);
// router.put("/validate", eventController.validateEvent);
// router.delete("/delete/:id", eventController.deleteEvent);

export default router;
