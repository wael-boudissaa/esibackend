import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class EventController {
  async getAllEvents(req: Request, res: Response) {
    try {
      const evenement = await prisma.evenement.findMany();
      res.json(evenement);
    } catch (error) {
      console.error("Error retrieving actualites:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving actualites." });
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
  
  async createEvent(req: Request, res: Response) {
    const {
      titre,
      description,
      date,
      idAuthor,
      image,
    }: {
      titre: string;
      description: string;
      date: string;
      idAuthor: string;
      image: string;
    } = req.body;
  
    const parsedAuthorId = parseInt(idAuthor);
  
    try {
      const author = await prisma.author.findUnique({
        where: { idAuthor: parsedAuthorId },
        include: { profile: true },
      });
  
      if (!author) {
        return res.status(404).json({ error: "Author not found." });
      }
  
      let status = "pending";
      if (author.profile.type === "responsableEveneemnt") {
        status = "accepted";
      }
  
      const event = await prisma.evenement.create({
        data: {
          author: { connect: { idAuthor: parsedAuthorId } },
          titre: titre,
          description: description,
          status: status,
          date: date,
          image: image,
        },
      });
  
      res.status(201).json({ message: "Event created successfully", event });
    } catch (err) {
      console.error("Error creating event:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }


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
