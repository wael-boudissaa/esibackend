import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



class ActualiteController {
  async getAllActualite(req: Request, res: Response) {
    try {
      const actualites = await prisma.actualite.findMany({
  include: {
    typeActualite: true,
  },
      });
      res.json(actualites);
    } catch (error) {
      console.error("Error retrieving actualites:", error);
      res.status(500).json({ error: "An error occurred while retrieving actualites." });
    }
  }
}
export default ActualiteController;
