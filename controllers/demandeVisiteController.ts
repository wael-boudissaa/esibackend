import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface DemandeVisitor {
  email: string;
  fullname: string;
  address: string;
  phone: string;
}

class DemandeVisiteController {
  async CreateDemandeVisite(req: Request, res: Response) {
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

      const createDemandeVisite = await prisma.demandevisite.create({
        data: {
          status: "pending",
          visitor: { connect: { idVisitor: visitorId } },
        },
      });

      res.status(201).json({
        message: "Demande Visite created successfully",
        demandeVisite: createDemandeVisite,
      });
    } catch (err) {
      console.error("Error creating demande visite:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async PatchDemandeVisite(req: Request, res: Response) {
    const { demandeVisiteId } = req.body;
    try {
      const updatedDemandeVisite = await prisma.demandevisite.update({
        where: {
          idDemandeVisite: parseInt(demandeVisiteId),
        },
        data: {
          status: "accepted",
        },
      });

      res.status(200).json({
        message: "Demande visite updated successfully",
        updatedDemandeVisite: updatedDemandeVisite,
      });
    } catch (err) {
      console.error("Error updating demande visite:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getDemandeVisite(req: Request, res: Response) {
    const { demandeVisiteId } = req.body;
    try {
      const getDemandeVisite = await prisma.demandevisite.findMany({});

      res.status(200).json({
        message: "Demande visite updated successfully",
        DemandeVisite: getDemandeVisite,
      });
    } catch (err) {
      console.error("Error updating demande visite:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default DemandeVisiteController;
