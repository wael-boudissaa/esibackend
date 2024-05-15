import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const EmailDemandeEvenementAlumni = (email: string) => {
  return `<h2>Merci pour votre intérêt à organiser un événement alumni ! ${email}</h2>
<p>Nous avons bien reçu votre demande pour organiser un événement alumni à l'École Nationale Supérieure d'Informatique (ESI). Nous sommes heureux de soutenir nos anciens élèves !</p>
<p>Pour continuer le processus de demande d'événement, veuillez répondre à cet e-mail avec toute information supplémentaire dont vous pourriez avoir besoin ou pour confirmer votre intérêt pour notre programme d'alumni.</p>
<p>Si vous avez des questions ou avez besoin d'une assistance supplémentaire, n'hésitez pas à nous contacter à [E-mail du Support].</p>
<p>Cordialement,<br>[ESI]</p>`;
};
class EvenementAlumniController {
  async getAllEvents(req: Request, res: Response) {
    try {
      const evenement = await prisma.evenementAlumni.findMany({
        include: {
          visitor: true,
        },
      });
      res.json(evenement);
    } catch (error) {
      console.error("Error retrieving actualites:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving actualites." });
    }
  }
  async createEvent(req: Request, res: Response) {
    const {
      titre,
      description,
      image,
      date,
      alumniId,
    }: {
      titre: string;
      description: string;
      image: string;
      date: Date;
      alumniId: number;
    } = req.body;
    try {
      const event = await prisma.evenementalumni.create({
        data: {
          idAlumni: alumniId,
          titre: titre,
          description: description,
          image: image,
          date: date,
        },
      });
      res
        .status(201)
        .json({ message: "Event Alumni created successfully", event });
    } catch (err) {
      console.error("Error creating event:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
export default EvenementAlumniController;
