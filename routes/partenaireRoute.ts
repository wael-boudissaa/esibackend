import express from "express";
import partenaireController from "../controllers/partenaireController";
const partenaire = new partenaireController();
const router = express.Router();

router.patch("/demande", partenaire.postDemandePartenaire);
router.get("/demande", partenaire.getDemandePatenaire);
// router.post("/demande", partenaire.DemandePartenaireAccepte);

export default router;
