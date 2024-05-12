import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface DemandeVisitor {
  email: string;
  fullname: string;
  address: string;
  phone: string;
}
class DemandeFormateurController {
  async CreateDemandeFormateur(req: Request, res: Response) {
    const { email, fullname, address, phone }: DemandeVisitor = req.body;
    try {
      let visitorId: number;

      const existingUser = await prisma.visitor.findUnique({
        where: {
          email: email,
        },
      });

      if (existingUser) {
        visitorId = existingUser.idVisitor;
      } else {
        const createVisitor = await prisma.visitor.create({
          data: {
            email: email,
            fullname: fullname,
            address: address,
            phone: phone,
          },
        });
        visitorId = createVisitor.idVisitor;
      }

      const createDemandeFormateur = await prisma.demandeformateur.create({
        data: {
          status: "pending",
          visitor: { connect: { idVisitor: visitorId } },
        },
      });

      res.status(201).json({
        message: "Demande Formateur created successfully",
        demandeFormateur: createDemandeFormateur,
      });
    } catch (err) {
      console.error("Error creating demande formateur:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async PatchDemandeFormateur(req: Request, res: Response) {
    const { demandeVisiteId } = req.body;
    try {
      const updatedDemandeFormateur = await prisma.demandeformateur.update({
        where: {
          idDemandeFormateur: parseInt(demandeVisiteId),
        },
        data: {
          status: "accepted",
        },
      });

      res.status(200).json({
        message: "Demande formateur updated successfully",
        updatedDemandeVisite: updatedDemandeFormateur,
      });
    } catch (err) {
      console.error("Error updating demande formateur:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getDemandeFormateur(req: Request, res: Response) {
    try {
      const getDemandeFormateur = await prisma.demandeformateur.findMany({});

      res.status(200).json({
        message: "Demande formateur updated successfully",
        DemandeVisite: getDemandeFormateur,
      });
    } catch (err) {
      console.error("Error updating demande formateur:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default DemandeFormateurController;
