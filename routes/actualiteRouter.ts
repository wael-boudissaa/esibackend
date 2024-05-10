import express from "express";
import ActualiteController from "../controllers/actualiteController";
const event = new ActualiteController();
const router = express.Router();
router.get('/all',event.getAllActualite)
export default router