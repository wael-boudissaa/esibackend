import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface DemandeVisitor {
  email: string;
  fullname: string;
  address: string;
  phone: string;
}
class DemandePartenaireController {
  async CreateDemandePartenaire(req: Request, res: Response) {
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

      const createDemandePartenaire = await prisma.demandepartenaire.create({
        data: {
          status: "pending", // Set status as needed
          visitor: { connect: { idVisitor: visitorId } },
        },
      });

      res.status(201).json({
        message: "Demande Partenaire created successfully",
        demandePartenaire: createDemandePartenaire,
      });
    } catch (err) {
      console.error("Error creating demande partenaire:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async PatchDemandePartenaire(req: Request, res: Response) {
    const { demandeVisiteId } = req.body;
    try {
      const updatedDemandePartenaire = await prisma.demandepartenaire.update({
        where: {
          idDemandePartenaire: parseInt(demandeVisiteId),
        },
        data: {
          status: "accepted",
        },
      });

      res.status(200).json({
        message: "Demande partenaire updated successfully",
        updatedDemandeVisite: updatedDemandePartenaire,
      });
    } catch (err) {
      console.error("Error updating demande partenaire:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getDemandePartenaire(req: Request, res: Response) {
    try {
      const getDemandePartenaire = await prisma.demandepartenaire.findMany({});

      res.status(200).json({
        message: "Demande partenaire updated successfully",
        DemandeVisite: getDemandePartenaire,
      });
    } catch (err) {
      console.error("Error updating demande partenaire:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default DemandePartenaireController;
