import express from "express";
import EventController from "../controllers/eventController";
import upload from "../middleware/uploadingImages";

const router = express.Router();
const eventController = new EventController();

router.get("/all", eventController.getAllEvents);
router.get("/all/accepted", eventController.getAllEventsAccepted);
router.get("/all/pending", eventController.getAllEventsPending);

router.get("/:id", eventController.getEventById);
router.get("/t/type/:idType", eventController.getEvenetByIdType);
router.get("/t/types", eventController.getAlllTypes);

router.post("/create", upload.single("image"), eventController.createEvent);
router.put("/validate", eventController.validateEvent);
router.delete("/delete/:id", eventController.deleteEvent);
router.get("/s/search", eventController.searchEventsByName);
router.get("/user/:id", eventController.getEvenetByUser);

export default router;
