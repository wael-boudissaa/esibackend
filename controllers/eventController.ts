import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class EventController {
  async getAllEvents(req: Request, res: Response) {
    try {
      const events = await prisma.evenement.findMany();
      res.json(events);
    } catch (error) {
      console.error("Error retrieving events:", error);
      res.status(500).json({ error: "An error occurred while retrieving events." });
    }
  }

  async getEventById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const event = await prisma.evenement.findUnique({
        where: {
          idEvenement: parseInt(id),
        },
      });
      if (!event) {
        return res.status(404).json({ error: "Event not found." });
      }
      res.json(event);
    } catch (error) {
      console.error("Error retrieving event:", error);
      res.status(500).json({ error: "An error occurred while retrieving event." });
    }
  }
  
//   async createEvent(req: Request, res: Response) {
//     const { clubId, responsableValidationId, titre, description, image, dateDebut, dateFin } = req.body;
//     try {
//         const newEvent = await prisma.evenement.create({
//             data: {
//                 club: {
//                     connect: {
//                         clubId: clubId
//                     }
//                 },
//                 responsablevalidation: {
//                     connect: {
//                         responsableValidationId: responsableValidationId
//                     }
//                 },
//                 titre: titre,
//                 description: description,
//                 image: image,
//                 dateDebut: new Date(dateDebut),
//                 dateFin: new Date(dateFin)
//             }
//         });
//         res.json(newEvent);
//     } catch (error) {
//         console.error('Error creating event:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }

  async validateEvent(req: Request, res: Response) {
    const { eventId, idAuthor } = req.body;
    try {
      const updatedEvent = await prisma.evenement.update({
        where: {
          idEvenement: eventId,
        },
        data: {
          author: { connect: { idAuthor: idAuthor } },
        },
      });
      res.json(updatedEvent);
    } catch (error) {
      console.error("Error validating event:", error);
      res.status(500).json({ error: "An error occurred while validating event." });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await prisma.evenement.delete({
        where: {
          idEvenement: parseInt(id),
        },
      });
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "An error occurred while deleting event." });
    }
  }
}

export default EventController;
