import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import emailController from "./emailController";
import { startOfMonth, endOfMonth } from "date-fns";

const prisma = new PrismaClient();

interface DemandeVisitor {
  email: string;
  fullname: string;
  address: string;
  phone: string;
  raison_visite: string;
  nom_organisation: string;
  nombre_participant: number;
}

export const EmailDemandeVisite = (email: string) => {
  return `<h2>Merci pour votre demande de visite !</h2>
  ${email}
<p>Nous avons bien reçu votre demande de visite à l'École Nationale Supérieure d'Informatique (ESI). Nous sommes impatients de vous accueillir sur notre campus !</p>
<p>Pour continuer le processus de demande de visite, veuillez répondre à cet e-mail avec toute information supplémentaire dont vous pourriez avoir besoin ou pour confirmer votre intérêt pour notre programme de visite.</p>
<p>Si vous avez des questions ou avez besoin d'une assistance supplémentaire, n'hésitez pas à nous contacter à [E-mail du Support].</p>
<p>Cordialement,<br>[ESI]</p>`;
};
class DemandeVisiteController {
  async CreateDemandeVisite(req: Request, res: Response) {
    const {
      email,
      fullname,
      address,
      phone,
      raison_visite,
      nom_organisation,
      nombre_participant,
    }: DemandeVisitor = req.body;
    try {
      let visitorId: number;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
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
          raisonVisite: raison_visite,
          nombreParticipant: nombre_participant,
          nomOrganisation: nom_organisation,
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
    const {
      demandeVisiteId,
      administratorId,
    }: { demandeVisiteId: number; administratorId: number } = req.body;

    try {
      const existingDemandeVisite = await prisma.demandevisite.findUnique({
        where: { idDemandeVisite: demandeVisiteId },
      });

      if (!existingDemandeVisite) {
        return res.status(404).json({ error: "DemandeVisite not found" });
      }

      const existingAdministrator = await prisma.administrator.findUnique({
        where: { idAdministrator: administratorId },
      });

      if (!existingAdministrator) {
        return res.status(404).json({ error: "Administrator not found" });
      }

      const traceValidation = await prisma.demandeVisite_Administrator.create({
        data: {
          idAdministrator: administratorId,
          validateAt: new Date(),
          idDemandeVisite: demandeVisiteId,
        },
      });

      if (traceValidation) {
        const updatedDemandeVisite = await prisma.demandevisite.update({
          where: {
            idDemandeVisite: demandeVisiteId,
          },
          data: {
            status: "accepte",
          },
          include: {
            visitor: {
              select: {
                email: true,
              },
            },
          },
        });

        const email = updatedDemandeVisite.visitor.email;
        const sendEmail = new emailController(email);
        await sendEmail.generateMail(EmailDemandeVisite(email), email);

        res.status(200).json({
          message: "Demande visite updated successfully",
          updatedDemandeVisite: updatedDemandeVisite,
        });
      } else {
        res.status(400).json({ error: "Something went wrong" });
      }
    } catch (err) {
      console.error("Error updating demande visite:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Other methods...

  async getDemandeVisite(req: Request, res: Response) {
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

  async getVisite(req: Request, res: Response) {
    try {
      const now = new Date();
      const startDate = startOfMonth(now);
      const endDate = endOfMonth(now);

      const getVisite = await prisma.visite.findMany({
        where: {
          dateVisite: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      res.status(200).json({
        message: "Visites for the current month fetched successfully",
        visites: getVisite,
      });
    } catch (err) {
      console.error("Error fetching visites for the current month:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async postVisite(req: Request, res: Response) {
    try {
      const { dateVisite, idAdministrator, status, capacite } = req.body;

      // Validate the required fields
      if (!dateVisite || !idAdministrator || !status || !capacite) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Create a new visite entry
      const newVisite = await prisma.visite.create({
        data: {
          dateVisite: dateVisite, // Ensure the date is in the correct format
          idAdministrator: Number(idAdministrator), // Ensure the ID is a number
          status: status,
          capacite: Number(capacite), // Ensure the capacity is a number
        },
      });

      res.status(201).json({
        message: "Visite created successfully",
        visite: newVisite,
      });
    } catch (err) {
      console.error("Error creating visite:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default DemandeVisiteController;
