import express from "express";
import DemandePartenaireController from "../controllers/demandePartenaireController";
import upload from "../middleware/uploadingImages";
import DemandeDevisController from "../controllers/demandeDevisController";
import DemandeFormateurController from "../controllers/demandeFormateur";
import DemandeVisiteController from "../controllers/demandeVisiteController";
// import uploadMiddleware from "../middleware/uploadingImages";

const demandePartenaire = new DemandePartenaireController();
const demandeDevis = new DemandeDevisController();
const demandeFormateur = new DemandeFormateurController();
const demandeVisite = new DemandeVisiteController();

const router = express.Router();

router.post("/partenaire", demandePartenaire.CreateDemandePartenaire);
router.post("/devis", demandeDevis.CreateDemandeDevis);
// router.post("/formateur", demandeFormateur.CreateDemandeFormateur);
// router.post("/visite", demandeVisite.CreateDemandeVisite);

router.get("/partenaire", demandePartenaire.getDemandePartenaire);
router.get("/devis", demandeDevis.getDemandeDevis);
// router.get("/formateur", demandeFormateur.getDemandeFormateur);
// router.get("/visite", demandeVisite.getDemandeVisite);

router.patch("/partenaire", demandePartenaire.PatchDemandePartenaire);
router.patch("/devis", demandeDevis.PatchDemandeDevis);
// router.patch("/formateur", demandeFormateur.PatchDemandeFormateur);
// router.patch("/visite", demandeVisite.PatchDemandeVisite);

// router.post("/create", upload.single("image"), event.createActuailte);

export default router;
