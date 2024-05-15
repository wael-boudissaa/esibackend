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

class partenaireController {
  async postDemandePartenaire(req: Request, res: Response) {
    try {
      const { email, fullname, phone, address } = req.body;

      const status = "false";

      // Check if the visitor with the given email exists
      let visitor = await prisma.visitor.findUnique({
        where: { email: email },
      });

      if (!visitor) {
        visitor = await prisma.visitor.create({
          data: {
            email: email,
            fullname: fullname,
            phone: phone,
            address: address,
          },
        });
      }

      const demandePartenaire = await prisma.demandepartenaire.create({
        data: {
          status: status,
          visitor: { connect: { idVisitor: visitor.idVisitor } },
        },
      });

      res.json(demandePartenaire);
    } catch (error) {
      console.error("Error creating demande partenaire:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async getDemandePatenaire(req: Request, res: Response) {
    try {
      const getDP = await prisma.demandepartenaire.findMany();
      res.json(getDP);
    } catch (err) {}
  }
  // async DemandePartenaireAccepte(req: Request, res: Response) {
  //   try {
  //     const { id, email, fullname, phone, address } = req.body;
  //     const demandeAccepte = await prisma.demandepartenaire.update({
  //       where: {
  //         idDemandePartenaire: id,
  //       },
  //       data: {
  //         status: "true",
  //       },
  //     });
  //     const password = generateRandomPassword();
  //     let sendEmail = new emailController(email, password);
  //     await createUser(email, password, fullname, phone, address, "partenaire");
  //     await sendEmail.generateMail(req, res);
  //   } catch (err) {
  //     console.error("Error updating demande partenaire:", err);
  //
  // }
 

  async getDemandeDevis(req: Request, res: Response) {
    try {
      const getDemandeDEvis = await prisma.demandedevis.findMany({});

      res.status(200).json({
        message: "Demande devis updated successfully",
        DemandePartenaire: getDemandeDEvis,
      });
    } catch (err) {
      console.error("Error updating demande devis:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
export default partenaireController;
