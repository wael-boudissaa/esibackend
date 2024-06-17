import express from "express";
import clubController from "../controllers/clubController";
const club = new clubController();
const router = express.Router();

router.get("/all", club.getAllClubs);
router.get("/:idClub", club.getClubById);
// // router.post("/demande", partenaire.DemandePartenaireAccepte);

export default router;
