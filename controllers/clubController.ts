import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export const createClub = async (req: Request, res: Response) => {
//     const { profile } = req.body;
//     try {
//         const newClub = await prisma.club.create({
//             data: {
//                 profile: {
//                     connect: { id: profile }
//                 }
//             }
//         });
//         res.status(201).json(newClub);
//     } catch (error) {
//         console.error('Error creating club:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export const getAllClubs = async (req: Request, res: Response) => {
//     try {
//         const clubs = await prisma.club.findMany();
//         res.status(200).json(clubs);
//     } catch (error) {
//         console.error('Error getting clubs:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export const getActivesClubs = async (req: Request, res: Response) => {
//     try {
//         const clubs = await prisma.club.findMany({
//             where: { isActive: true }
//         });
//         res.status(200).json(clubs);
//     } catch (error) {
//         console.error('Error getting clubs:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
export class clubController {
  async getClubById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const club = await prisma.club.findUnique({
        where: { idClub: parseInt(id) },
      });
      if (!club) {
        res.status(404).json({ error: "Club not found" });
      } else {
        res.status(200).json(club);
      }
    } catch (error) {
      console.error("Error getting club by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
//   async createDemandeEvenementClub (req:Request, res:Response){
//     const {email,phone,fullname,raison_}
//   }
}

// export const updateClub = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const { profile } = req.body;
//     try {
//         const updatedClub = await prisma.club.update({
//             where: { idClub: parseInt(id) },
//             data: {
//                 profile: {
//                     connect: { id: profile }
//                 }
//             }
//         });
//         res.status(200).json(updatedClub);
//     } catch (error) {
//         console.error('Error updating club:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export const deleteClub = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         const deletedClub = await prisma.club.update({
//             where: { clubId: parseInt(id) },
//             data: { isActive: false}
//         });
//         console.log('deleted club : ' + deletedClub);
//         res.status(204).end();
//     } catch (error) {
//         console.error('Error deleting club:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
