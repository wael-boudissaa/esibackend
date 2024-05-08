import express from 'express';
import * as clubController from '../controllers/clubController';

const router = express.Router();

router.post('/create', clubController.createClub);
router.get('/allclubs', clubController.getAllClubs);
router.get('/:id', clubController.getClubById);
router.put('/update/:id', clubController.updateClub);
router.delete('/delete/:id', clubController.deleteClub);

export default router;
