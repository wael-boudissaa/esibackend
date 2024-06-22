import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { MulterRequest } from "./eventController";

const prisma = new PrismaClient();

export class sectionContoller {
  async getSectionPage(req: Request, res: Response) {
    const { idPage } = req.body;
    try {
      const sections = await prisma.page.findUnique({
        include: {
          section: true,
        },
        where: { idPage: parseInt(idPage) },
      });
      if (!sections) {
        res.status(404).json({ error: "page not found" });
      } else {
        res.status(200).json(sections);
      }
    } catch (error) {
      console.error("Error getting page by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async getHeroSection(req: Request, res: Response) {
    const { idPage } = req.body;
    try {
      const herosection = await prisma.page.findUnique({
        include: {
          hersection: true,
        },
        where: { idPage: parseInt(idPage) },
      });
      if (!herosection) {
        res.status(404).json({ error: "page not found" });
      } else {
        res.status(200).json(herosection);
      }
    } catch (error) {
      console.error("Error getting page by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getGallerie(req: Request, res: Response) {
    const { idPage } = req.body;
    try {
      const gallerie = await prisma.gallerie.findMany({});
      if (!gallerie) {
        res.status(404).json({ error: "page not found" });
      } else {
        res.status(200).json(gallerie);
      }
    } catch (error) {
      console.error("Error getting images by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async PostGallerie(req: Request, res: Response) {
    try {
      const { type } = req.body;
      const imaget = (req as MulterRequest).file.path;
      const createGallerie = await prisma.gallerie.create({
        data: {
          link: imaget,
          type: type,
        },
      });
      res.status(201).json(createGallerie);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the gallerie." });
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateSection(req: Request, res: Response) {
    const { idSection } = req.params;
    const { titreSection, typeSection, description, link, image } = req.body;

    try {
      const section = await prisma.section.findUnique({
        where: { idSection: Number(idSection) },
      });

      if (!section) {
        return res.status(404).json({ error: "Section not found" });
      }

      // Update the section
      const updatedSection = await prisma.section.update({
        where: { idSection: Number(idSection) },
        data: {
          titreSection,
          typeSection,
          description,
          link,
          image,
        },
      });

      // Return the updated section
      res.json(updatedSection);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the section" });
    } finally {
      await prisma.$disconnect();
    }
  }
}
