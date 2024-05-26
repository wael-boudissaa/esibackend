import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const multer = require("multer");

export interface MulterRequest extends Request {
  file: any;
}

class EventController {
  async getAllEvents(req: Request, res: Response) {
    try {
      const evenement = await prisma.evenement.findMany();
      res.json(evenement);
    } catch (error) {
      console.error("Error retrieving events:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving events." });
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
    }: {
      titre: string;
      description: string;
      date: string;
      idAuthor: string;
      image: string;
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
      if (author.profile.type === "responsableEvenement") {
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
        },
      });

      res.status(201).json({ message: "Event created successfully", event });
    } catch (err) {
      console.error("Error creating event:", err);
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

  // async deleteEvent(req: Request, res: Response) {
  //   const { id } = req.params;
  //   try {
  //     await prisma.evenement.delete({
  //       where: {
  //         idEvenement: parseInt(id),
  //       },
  //     });
  //     res.sendStatus(204);
  //   } catch (error) {
  //     console.error("Error deleting event:", error);
  //     res.status(500).json({ error: "An error occurred while deleting event." });
  //   }
  // }
}

export default EventController;
