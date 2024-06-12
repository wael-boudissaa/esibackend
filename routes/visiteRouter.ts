import { Router } from "express";
import { authentificationController } from "../controllers/authentificationController";
const route = Router();
import upload from "../middleware/uploadingImages";
import DemandeVisiteController from "../controllers/demandeVisiteController";

const visite = new DemandeVisiteController();
route.post("/getmonth", visite.getVisite);
route.post("/creer", visite.postVisite);

export default route;
