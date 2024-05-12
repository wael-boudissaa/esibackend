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
  //!!! ACTUALITE CREATE
  async createActuailte(req: Request, res: Response) {
    const {
      titre,
      description,
      date,
      authorId,
      typeId,
      image,
    }: {
      titre: string;
      description: string;
      date: Date;
      authorId: string;
      typeId: string;
      image: string;
    } = req.body;
    const imaget = (req as MulterRequest).file.path;

    const parsedAuthorId = parseInt(authorId);
    const parsedTypeId = parseInt(typeId);
    try {
      const actualite = await prisma.actualite.create({
        data: {
          author: { connect: { idAuthor: parsedAuthorId } },
          typeActualite: { connect: { idTypeActualite: parsedTypeId } },
          titre: titre,
          description: description,
          image: imaget,
          date: date,
        },
      });
      res
        .status(201)
        .json({ message: "Actualite created successfully", actualite });
    } catch (err) {
      console.error("Error creating actualite:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
export default ActualiteController;
