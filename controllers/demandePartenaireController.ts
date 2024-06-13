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
export const EmailDemandePartenaire = (email: string) => {
  return `<h2>Merci pour votre demande de partenariat !</h2>
${email}
<p>Nous avons bien reçu votre demande de partenariat avec l'École Nationale Supérieure d'Informatique (ESI). Nous sommes impatients de collaborer avec vous !</p>
<p>Pour continuer le processus de partenariat, veuillez répondre à cet e-mail avec toute information supplémentaire dont vous pourriez avoir besoin ou pour confirmer votre intérêt pour notre collaboration.</p>
<p>Si vous avez des questions ou avez besoin d'une assistance supplémentaire, n'hésitez pas à nous contacter à [E-mail du Support].</p>
<p>Cordialement,<br>[ESI]</p>`;
};
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
    const { demandePartenaireId, authorId } = req.body;

    try {
      const authorWithDre = await prisma.author.findUnique({
        where: {
          idAuthor: authorId, // Replace `authorId` with the actual author ID
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

      const traceValidation = await prisma.demandePartenaire_DRE.create({
        data: {
          idDemandePartenaire: parseInt(demandePartenaireId),
          idDRE: dreId,
          ValidatedAt: new Date(),
        },
      });
      if (traceValidation) {
        const updatedDemandePartenaire = await prisma.demandepartenaire.update({
          where: {
            idDemandePartenaire: parseInt(demandePartenaireId),
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
        const email = updatedDemandePartenaire.visitor.email;
        let sendEmail = new emailController(email);
        await sendEmail.generateMail(EmailDemandePartenaire(email), email);
        res.status(200).json({
          message: "Demande Partenaire updated successfully",
          updatedDemandePartenaire: updatedDemandePartenaire,
        });
      } else {
        res.status(400).json({ error: "Something Wrong" });
      }
    } catch (err) {
      console.error("Error updating demande devis:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async getDemandePartenaire(req: Request, res: Response) {
    try {
      const getDemandePartenaire = await prisma.demandepartenaire.findMany({
        include: {
          visitor: true,
        },
      });

      res.status(200).json({
        message: "Demande partenaire updated successfully",
        DemandePartenaire: getDemandePartenaire,
      });
    } catch (err) {
      console.error("Error updating demande partenaire:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default DemandePartenaireController;
