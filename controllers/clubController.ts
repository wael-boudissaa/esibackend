import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import emailController, { generateRandomPassword } from "./emailController";
// import { generateId } from "..";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// export const createUser = async (
//   email: string,
//   password: string,
//   fullname: string,
//   phone: string,
//   address: string,
//   type: string
// ) => {
//   try {
//     const ROUND: number = process.env.KEY_ROUND
//       ? parseInt(process.env.KEY_ROUND, 10)
//       : 10;
//     const passwordC = await bcrypt.hash(password, ROUND);

//     const createProfile = await prisma.profile.create({
//       data: {
//         email: email,
//         password: passwordC,
//         fullname: fullname,
//         phone: phone,
//         adresse: address,
//       },
//     });

//     if (type === "partenaire") {
//       const createPartenaire = await prisma.partenaire.create({
//         data: {
//           profile: {
//             connect: { id: createProfile.id }, // Link to the created profile
//           },
//         },
//       });
//       return createPartenaire;
//     } else {
//       return createProfile;
//     }
//   } catch (error) {
//     console.error("Error creating user:", error);
//     throw error;
//   }
// };

class clubController {
  getAllClubs = async (req: Request, res: Response) => {
    try {
      const clubs = await prisma.club.findMany();
      res.status(200).json(clubs);
    } catch (error) {
      console.error("Error getting clubs:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getClubById = async (req: Request, res: Response) => {
    const { idClub } = req.params;

    try {
      console.log(idClub);
      const club = await prisma.club.findUnique({
        where: { idClub: Number(idClub) },
      });

      if (!club) {
        return res.status(404).json({ error: "Club not found" });
      }

      res.status(200).json(club);
    } catch (error) {
      console.error("Error getting club:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}
export default clubController;
