import express from "express";
import eventController from "../controllers/eventController";
const event = new eventController();
const router = express.Router();
router.get('/all',event.getAllEvents)
export default router