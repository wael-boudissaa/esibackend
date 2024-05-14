import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface DemandeVisitor {
  email: string;
  fullname: string;
  address: string;
  phone: string;
}
class DemandeDevisController {
  async CreateDemandeDevis(req: Request, res: Response) {
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

      const createDemandeDevis = await prisma.demandedevis.create({
        data: {
          visitor: { connect: { idVisitor: visitorId } },
          status: "pending", // Set status as needed
          createdAt: new Date()
        },
      });

      res.status(201).json({
        message: "Demande Partenaire created successfully",
        demandeDevis: createDemandeDevis,
      });
    } catch (err) {
      console.error("Error creating demande partenaire:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async PatchDemandeDevis(req: Request, res: Response) {
    const { demandeVisiteId } = req.body;
    try {
      const updatedDemandeDevis = await prisma.demandedevis.update({
        where: {
          idDemandeDevis: parseInt(demandeVisiteId),
        },
        data: {
          status: "accepted",
        },
      });

      res.status(200).json({
        message: "Demande devis updated successfully",
        updatedDemandeVisite: updatedDemandeDevis,
      });
    } catch (err) {
      console.error("Error updating demande devis:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getDemandeDevis(req: Request, res: Response) {
    try {
      const getDemandeDEvis = await prisma.demandedevis.findMany({});

      res.status(200).json({
        message: "Demande devis updated successfully",
        DemandeVisite: getDemandeDEvis,
      });
    } catch (err) {
      console.error("Error updating demande devis:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default DemandeDevisController;
