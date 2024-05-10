import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class formationController {
  async getFormation(res: Response, req: Request) {
    try {
      const formation = await prisma.formation.findMany();
      res.status(200).json(formation);
    } catch (err) {
      throw err;
    }
  }
  async getFormateur(res: Response, req: Request) {
    try {
      const formateur = await prisma.formateur.findMany();
      res.status(200).json(formateur);
    } catch (err) {
      throw err;
    }
  }
  async getDomaine(res: Response, req: Request) {
    try {
      const domaine = await prisma.domaine.findMany();
      res.status(200).json(domaine);
    } catch (err) {
      throw err;
    }
  }
  async getTheme(res: Response, req: Request) {
    try {
      const theme = await prisma.theme.findMany();
      res.status(200).json(theme);
    } catch (err) {
      throw err;
    }
  }
  // async getParticipant(res: Response, req: Request) {
  //   try {
  //     const participant = await prisma.participant.findMany();
  //     res.status(200).json(participant);
  //   } catch (err) {
  //     throw err;
  //   }
  // }
  // async getParticipantFormation(res: Response, req: Request) {
  //   const formationId = req.body.formationId;
  //   try {
  //     const participant = await prisma.participant.findMany({
  //       where: {
  //         formationId: parseInt(formationId),
  //       },
  //     });
  //     res.status(200).json(participant);
  //   } catch (err) {
  //     throw err;
  //   }
  // }
  // async getParticipantGroupe(res: Response, req: Request) {
  //   const groupeId = req.body.groupeId;
  //   try {
  //     const participant = await prisma.participant.findMany({
  //       where: {
  //         groupeId: parseInt(groupeId),
  //       },
  //     });
  //     res.status(200).json(participant);
  //   } catch (err) {
  //     throw err;
  //   }
  // }
  async getFormateurFormation(res: Response, req: Request) {
    const {formationId} = req.body;
    try {
      const formateur = await prisma.formation.findMany({
        where:{
          idFormation : formationId,
          
        },
        include: {
          formateur: true,
        },
      });
      res.status(200).json(formateur);
    } catch (err) {
      throw err;
    }
  }
}
export default formationController;
