import express from 'express';
import * as clubController from '../controllers/sectionController';
import EventController from '../controllers/eventController';

const router = express.Router();
const evenement = new EventController();
// router.post('/create', clubController.createClub);
// router.get('/allclubs', clubController.getAllClubs);
// // router.get('/activesclubs', clubController.getActivesClubs);
// router.get('/:id', clubController.getClubById);
// router.put('/update/:id', clubController.updateClub);
// router.delete('/delete/:id', clubController.deleteClub);
export default router;
