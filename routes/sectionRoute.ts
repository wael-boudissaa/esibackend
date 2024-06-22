import express from "express";
import * as clubController from "../controllers/sectionController";
import EventController from "../controllers/eventController";
import upload from "../middleware/uploadingImages";

const router = express.Router();
const section = new clubController.sectionContoller();
// router.post('/create', clubController.createClub);
// router.get('/allclubs', clubController.getAllClubs);
// // router.get('/activesclubs', clubController.getActivesClubs);
// router.get('/:id', clubController.getClubById);
// router.put('/update/:id', clubController.updateClub);
// router.delete('/delete/:id', clubController.deleteClub);

router.get("/gallerie", section.getGallerie);
router.get("/hero", section.getHeroSection);

router.post("/gallerie", upload.single("image"), section.PostGallerie);
router.get("/all", section.getSectionPage);
router.put("/update/:idSection", section.updateSection);

export default router;
