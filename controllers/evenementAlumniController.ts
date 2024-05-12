import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class EvenementAlumniController {
  async getAllEvents(req: Request, res: Response) {
    try {
      const evenement = await prisma.evenementalumni.findMany({
        include: {
          visitor: true,
        },
      });
      res.json(evenement);
    } catch (error) {
      console.error("Error retrieving actualites:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving actualites." });
    }
  }
  async createEvent(req: Request, res: Response) {
    const {
      titre,
      description,
      image,
      date,
      alumniId,
    }: {
      titre: string;
      description: string;
      image: string;
      date: Date;
      alumniId: number;
    } = req.body;
    try {
      const event = await prisma.evenementalumni.create({
        data: {
          idAlumni: alumniId,
          titre: titre,
          description: description,
          image: image,
          date: date,
        },
      });
      res
        .status(201)
        .json({ message: "Event Alumni created successfully", event });
    } catch (err) {
      console.error("Error creating event:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

}
export default EvenementAlumniController;
