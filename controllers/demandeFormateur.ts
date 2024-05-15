import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface DemandeVisitor {
  email: string;
  fullname: string;
  address: string;
  phone: string;
}
export const EmailDemandeFormateur = (email: string) => {
  return `<h2>Merci pour votre intérêt à devenir formateur ! ${email}</h2>
<p>Nous avons bien reçu votre demande pour devenir formateur à l'École Nationale Supérieure d'Informatique (ESI). Nous sommes heureux de vous accueillir dans notre équipe !</p>
<p>Pour continuer le processus de recrutement, veuillez répondre à cet e-mail avec toute information supplémentaire dont vous pourriez avoir besoin ou pour confirmer votre intérêt pour notre programme de formation.</p>
<p>Si vous avez des questions ou avez besoin d'une assistance supplémentaire, n'hésitez pas à nous contacter à [E-mail du Support].</p>
<p>Cordialement,<br>[ESI]</p>`;
};

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
