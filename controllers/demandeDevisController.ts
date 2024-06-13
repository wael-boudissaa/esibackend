import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import emailController from "./emailController";
const prisma = new PrismaClient();

interface DemandeVisitor {
  email: string;
  fullname: string;
  address: string;
  phone: string;
}
export const EmailDemandeDevis = (email: string) => {
  return `<h2>Merci pour votre demande de devis !</h2>
${email}
<p>Nous avons bien reçu votre demande de devis pour une formation à l'École Nationale Supérieure d'Informatique (ESI). Nous sommes ravis de vous accompagner dans votre projet de formation !</p>
<p>Pour continuer le processus de demande de devis, veuillez répondre à cet e-mail avec toute information supplémentaire dont vous pourriez avoir besoin ou pour confirmer votre intérêt pour nos offres de formation.</p>
<p>Si vous avez des questions ou avez besoin d'une assistance supplémentaire, n'hésitez pas à nous contacter à [E-mail du Support].</p>
<p>Cordialement,<br>[ESI]</p>`;
};
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
          createdAt: new Date(),
        },
      });

      res.status(201).json({
        message: "Demande devis created successfully",
        demandeDevis: createDemandeDevis,
      });
    } catch (err) {
      console.error("Error creating demande partenaire:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async PatchDemandeDevis(req: Request, res: Response) {
    const { demandeDevisId, authorId } = req.body;

    try {
      // Retrieve DRE ID associated with the author
      const authorWithDre = await prisma.author.findUnique({
        where: {
          idAuthor: authorId,
        },
        include: {
          dre: {
            select: {
              idDre: true,
            },
          },
        },
      });

      const dreId = authorWithDre?.dre?.idDre;

      if (!dreId) {
        throw new Error("DRE ID not found for the given author");
      }

      // Create a new record in demandeDevis_DRE
      const traceValidation = await prisma.demandeDevis_DRE.create({
        data: {
          idDemandeDevis: parseInt(demandeDevisId),
          idDRE: dreId,
          ValidatedAt: new Date(),
        },
      });

      if (!traceValidation) {
        throw new Error("Failed to create traceValidation");
      }

      // Update demande devis status to "accepted"
      const updatedDemandeDevis = await prisma.demandedevis.update({
        where: {
          idDemandeDevis: parseInt(demandeDevisId),
        },
        data: {
          status: "accepted",
        },
        include: {
          visitor: {
            select: {
              email: true,
            },
          },
        },
      });

      const email = updatedDemandeDevis.visitor.email;
      // Assuming emailController and EmailDemandeDevis are correctly implemented
      let sendEmail = new emailController(email);
      await sendEmail.generateMail(EmailDemandeDevis(email), email);

      res.status(200).json({
        message: "Demande Devis updated successfully",
        updatedDemandeDevis: updatedDemandeDevis,
      });
    } catch (err) {
      console.error("Error updating demande devis:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getDemandeDevis(req: Request, res: Response) {
    try {
      const getDemandeDEvis = await prisma.demandedevis.findMany({
        include: { visitor: true },
      });

      res.status(200).json({
        message: "Demande devis updated successfully",
        DemandeDevis: getDemandeDEvis,
      });
    } catch (err) {
      console.error("Error updating demande devis:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default DemandeDevisController;
