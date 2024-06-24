import { Request, Response } from "express";
import { PrismaClient, ProfileType } from "@prisma/client"; // Import ProfileType from Prisma

const prisma = new PrismaClient();
const multer = require("multer");

export interface MulterRequest extends Request {
  file: any;
}

class EventController {
  async getAllEvents(req: Request, res: Response) {
    try {
      const evenement = await prisma.evenement.findMany({
        include: {
          typeEvenement: true,
        },
      });
      res.json(evenement);
    } catch (error) {
      console.error("Error retrieving events:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving events." });
    }
  }
  async getAllEventsAccepted(req: Request, res: Response) {
    try {
      const evenement = await prisma.evenement.findMany({
        include: {
          typeEvenement: true,
        },
        where: {
          status: "accepted",
        },
      });
      res.json(evenement);
    } catch (error) {
      console.error("Error retrieving events:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving events." });
    }
  }
  async getAllEventsPending(req: Request, res: Response) {
    try {
      const evenement = await prisma.evenement.findMany({
        include: {
          typeEvenement: true,
        },
        where: {
          status: "pending",
        },
      });
      res.json(evenement);
    } catch (error) {
      console.error("Error retrieving events:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving events." });
    }
  }

  async getAlllTypes(req: Request, res: Response) {
    try {
      const typeEvents = await prisma.typeEvenement.findMany();
      res.json(typeEvents);
    } catch (error) {
      console.error("Error retrieving types:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving types." });
    }
  }
  async getEventById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const event = await prisma.evenement.findUnique({
        where: {
          idEvenement: parseInt(id),
        },
        include: {
          typeEvenement: true,
        },
      });
      if (!event) {
        return res.status(404).json({ error: "Event not found." });
      }
      res.json(event);
    } catch (error) {
      console.error("Error retrieving event:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving event." });
    }
  }
  async getEvenetByUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const event = await prisma.evenement.findMany({
        where: {
          idAuthor: parseInt(id),
        },
        include: {
          typeEvenement: true,
        },
      });
      if (!event) {
        return res.status(404).json({ error: "Event not found." });
      }
      res.json(event);
    } catch (error) {
      console.error("Error retrieving event:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving event." });
    }
  }
  async getEvenetByIdType(req: Request, res: Response) {
    const { idType } = req.params;
    try {
      const event = await prisma.typeEvenement.findUnique({
        where: {
          idTypeEvenement: parseInt(idType),
        },
        include: {
          evenement: true,
        },
      });
      if (!event) {
        return res.status(404).json({ error: "Event not found." });
      }
      res.json(event.evenement);
    } catch (error) {
      console.error("Error retrieving event:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving event." });
    }
  }
  async createEvent(req: Request, res: Response) {
    const {
      titre,
      description,
      date,
      idAuthor,
      image,
      idType,
    }: {
      titre: string;
      description: string;
      date: string;
      idAuthor: string;
      image: string;
      idType: string;
    } = req.body;

    const imaget = (req as MulterRequest).file.path;
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
      if (author.profile.type === ProfileType.responsableEvenement) {
        status = "accepted";
      }

      const event = await prisma.evenement.create({
        data: {
          author: { connect: { idAuthor: parsedAuthorId } },
          titre: titre,
          description: description,
          status: status,
          date: date,
          image: imaget,
          typeEvenement: { connect: { idTypeEvenement: parseInt(idType) } },
        },
      });

      res.status(201).json({ message: "Event created successfully", event });
    } catch (err) {
      console.error("Error creating event:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async searchEventsByName(req: Request, res: Response) {
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid or missing 'name' parameter." });
    }

    try {
      const events = await prisma.evenement.findMany({
        where: {
          titre: {
            startsWith: name.toString(),
          },
        },
      });

      res.status(200).json({ events });
    } catch (err) {
      console.error("Error searching for events:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async validateEvent(req: Request, res: Response) {
    const {
      idRespoEvent,
      evenementId,
    }: {
      idRespoEvent: string;
      evenementId: string;
    } = req.body;
    try {
      const eventIdInt = parseInt(evenementId);
      const respoEvent = parseInt(idRespoEvent);

      const ValidateOnTime =
        await prisma.validate_Evenement_ResponsableEvenement.create({
          data: {
            responsableEvenementId: respoEvent,
            evenementId: eventIdInt,
            ValidatedAt: new Date(),
          },
        });
      if (ValidateOnTime) {
        const validateEvent = await prisma.evenement.update({
          where: { idEvenement: eventIdInt },
          data: { status: "accepted" },
        });
        res.status(200).json({
          message: "Event updated successfully",
          updatedDemandeVisite: validateEvent,
        });
      } else {
        res.status(500).json({ error: "Something wrong " });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deleted = await prisma.evenement.delete({
        where: {
          idEvenement: parseInt(id),
        },
      });
      res.status(200).json({ message: "Event Deleted" });
    } catch (error) {
      console.error("Error deleting event:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting event." });
    }
  }
}

export default EventController;
