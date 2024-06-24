import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const { storage, cloudinary } = require("../storage/storage");

import uploadingImages from "../middleware/uploadingImages";
const prisma = new PrismaClient();
const multer = require("multer");
const upload = multer({ storage });
const app: Express = express();
export interface MulterRequest extends Request {
  file: any;
}

class ActualiteController {
  async getActualiteByUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const actualite = await prisma.actualite.findMany({
        where: {
          idAuthor: parseInt(id),
        },
        include: {
          typeActualite: true,
        },
      });
      if (!actualite) {
        return res.status(404).json({ error: "Actualite not found." });
      }
      res.json(actualite);
    } catch (error) {
      console.error("Error retrieving Actualite:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving event." });
    }
  }
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
      res
        .status(500)
        .json({ error: "An error occurred while retrieving actualites." });
    }
  }
  async getAlllTypes(req: Request, res: Response) {
    try {
      const typeActualite = await prisma.typeActualite.findMany();
      res.json(typeActualite);
    } catch (error) {
      console.error("Error retrieving types:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving types." });
    }
  }

  async getActualiteById(req: Request, res: Response) {
    const { idActualite } = req.params;
    try {
      const actualite = await prisma.actualite.findUnique({
        where: {
          idActualite: parseInt(idActualite),
        },
        include: {
          typeActualite: true,
        },
      });
      if (!actualite) {
        return res.status(404).json({ error: "Actualite not found." });
      }
      res.json(actualite);
    } catch (error) {
      console.error("Error retrieving actualite:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving actualite." });
    }
  }
  //!!! ACTUALITE CREATE
  async createActuailte(req: Request, res: Response) {
    const {
      titre,
      description,
      date,
      authorId,
      typeId,
      file,
      image,
    }: {
      titre: string;
      description: string;
      date: Date;
      authorId: string;
      typeId: string;
      file: string;
      image: string;
    } = req.body;
    const imaget = (req as MulterRequest).file.path;

    const parsedAuthorId = parseInt(authorId);
    const parsedTypeId = parseInt(typeId);

    try {
      const author = await prisma.author.findUnique({
        where: { idAuthor: parsedAuthorId },
        include: { profile: true },
      });

      let actualite: any;

      if (author?.profile.type == "administrator") {
        actualite = await prisma.actualite.create({
          data: {
            author: { connect: { idAuthor: parsedAuthorId } },
            typeActualite: { connect: { idTypeActualite: parsedTypeId } },
            titre: titre,
            description: description,
            status: "accepted",
            image: imaget,
            file: file,
            date: new Date(),
          },
        });
      } else {
        actualite = await prisma.actualite.create({
          data: {
            author: { connect: { idAuthor: parsedAuthorId } },
            typeActualite: { connect: { idTypeActualite: parsedTypeId } },
            titre: titre,
            description: description,
            status: "pending",
            image: imaget,
            file: file,
            date: new Date(),
          },
        });
      }

      res
        .status(201)
        .json({ message: "Actualite created successfully", actualite });
    } catch (err) {
      console.error("Error creating actualite:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async ValidateActualite(req: Request, res: Response) {
    const {
      idAdministrator,
      actualiteId,
    }: {
      idAdministrator: string;
      actualiteId: string;
    } = req.body;
    try {
      const actualiteIdInt = parseInt(actualiteId);
      const administrator = parseInt(idAdministrator);

      const ValidateOnTime =
        await prisma.validate_Actualite_Administrator.create({
          data: {
            AdministratorId: administrator,
            actualiteId: actualiteIdInt,
            ValidatedAt: new Date(),
          },
        });
      if (ValidateOnTime) {
        const validateActualite = await prisma.actualite.update({
          where: { idActualite: actualiteIdInt },
          data: { status: "accepted" },
        });
        res.status(200).json({
          message: "Actualite updated successfully",
          updatedDemandeVisite: validateActualite,
        });
      } else {
        res.status(500).json({ error: "Something wrong " });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async DeleteActualite(req: Request, res: Response) {
    const { idActualite } = req.body;
    try {
      const deleted = await prisma.actualite.delete({
        where: {
          idActualite: parseInt(idActualite),
        },
      });

      res.status(200).json({ message: "Actualite Deleted" });
    } catch (error) {
      console.error("Error deleting actualite:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting actualite." });
    }
  }
}

export default ActualiteController;
