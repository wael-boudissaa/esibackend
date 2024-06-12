import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { profile } from "console";
import { PrismaClient } from "@prisma/client";
import { MulterRequest } from "./actualiteController";
const prisma = new PrismaClient();

// interface JwtOptions {
//   expiresIn: string | number;
// }
const jwtSecret: string =
  (process.env.JWT_SECRET as string) || "1VSDQ44BR6ER6486T1E61QNT6NT46N84Q";

const jwtOptionsAccess: jwt.SignOptions = {
  expiresIn: "1h",
};
const jwtOptionsRefresh: jwt.SignOptions = {
  expiresIn: "10h",
};

// const createAccesToken = (id: string, type: string) => {
//   return jwt.sign({ id: id, type: type }, "accesbaba", { expiresIn: "15min" });
// };

// const createRefreshToken = (id: string, type: string, expiresIn = "1d") => {
//   const payload = {
//     id: id,
//     type: type,
//   };
// };

interface RequestBody {
  email: string;
  password: string;
}
interface RequestBodyCreateUser {
  email: string;
  password: string;
  fullname: string;
  address: string;
  phone: string;
  image: string;
  type: ProfileType;
  last_login: string;
}
enum ProfileType {
  club = "club",
  responsableEvenement = "responsableEvenement",
  administrator = "administrator",
  dre = "dre",
}

const ROUND: number = process.env.KEY_ROUND
  ? parseInt(process.env.KEY_ROUND, 10)
  : 10;

export class authentificationController {
  // async login(req: Request, resp: Response) {
  //   const { email, password }: RequestBody = req.body;

  //   if (!email) {
  //     resp.status(400).send({ message: "Please enter an email address" });
  //     console.log("email is required");
  //   }

  //   if (!password) {
  //     resp.status(400).send({ message: "Please enter a password" });
  //     console.log("password is required");
  //   }

  //   try {
  //     const user = await prisma.profile.findUnique({ where: { email: email } });

  //     if (!user) {
  //       return resp.status(401).send({ message: "User not found" });
  //     }
  //     //!!! Verifier si l'email existe
  //     const hashPassword1 = await bcrypt.hash(password, ROUND);

  //     const hashPassword = await bcrypt.compare(password, user.password);
  //     // !!!! Verifier si mot passe juste

  //     if (hashPassword) {
  //       const Refreshtoken = jwt.sign(
  //         { email: email },
  //         jwtSecret,
  //         jwtOptionsRefresh
  //       );
  //       const AcessToken = jwt.sign(
  //         { email: email },
  //         jwtSecret,
  //         jwtOptionsAcces
  //       );

  //       const updateUser = await prisma.profile.update({
  //         where: { email: email }, // Specify the condition to find the user
  //         data: {
  //           refreshToken: Refreshtoken,
  //           last_login: new Date(), // Use new Date() to get the current date and time
  //         },
  //       });

  //       //!! Generate A new token and Sign in with update the user information ((date derniere inscription ))
  //       // console.log(updateUser);
  //       resp.cookie("token", AcessToken, { httpOnly: true, secure: true });
  //       resp.status(200).send({ message: "Login successful", AcessToken });
  //     } else {
  //       resp
  //         .status(200)
  //         .send({ message: "password does not match", hashPassword });
  //     }

  //     //!! Verifier password
  //     // ??? Update refresh token on the database and create new acces token
  //   } catch (error) {
  //     console.error("Error occurred during login:", error);
  //     return resp.status(500).send({ message: "Internal server error" });
  //   }
  // }
  async login(req: Request, res: Response) {
    const { email, password }: { email: string; password: string } = req.body;

    if (!email) {
      console.log("email is required");
      return res.status(400).send({ message: "Please enter an email address" });
    }

    if (!password) {
      console.log("password is required");
      return res.status(400).send({ message: "Please enter a password" });
    }

    try {
      const user = await prisma.profile.findUnique({ where: { email: email } });

      if (!user) {
        return res.status(401).send({ message: "User not found" });
      }

      const hashPassword = await bcrypt.compare(password, user.password);

      if (!hashPassword) {
        return res.status(401).send({ message: "Password does not match" });
      }

      const refreshToken = jwt.sign(
        { type: user.type, id: user.id },
        jwtSecret,
        jwtOptionsRefresh
      );
      const accessToken = jwt.sign(
        { 
          
          type: user.type, id: user.id },
        jwtSecret,
        jwtOptionsAccess
      );

      await prisma.profile.update({
        where: { email: email },
        data: {
          refreshToken: refreshToken,
          last_login: new Date(),
        },
      });

      res.cookie("token", accessToken, { httpOnly: true, secure: true });
      return res
        .status(200)
        .send({ message: "Login successful", accessToken, user: user });
    } catch (error) {
      console.error("Error occurred during login:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async createUser(req: Request, resp: Response) {
    const {
      email,
      password,
      fullname,
      address,
      phone,
      image,
      type,
      last_login,
    }: RequestBodyCreateUser = req.body;

    try {
      const imaget = (req as MulterRequest).file.path;
      if (!email) {
        throw new Error("Please enter an email address");
      }

      if (!password) {
        throw new Error("Please enter a password");
      }

      const newPassword = await bcrypt.hash(password, ROUND);

      const existingUser = await prisma.profile.findUnique({
        where: {
          email: email,
        },
      });

      if (existingUser) {
        throw new Error("Email already in use");
      }

      // Create a new user
      const newUser = await prisma.profile.create({
        data: {
          email: email,
          password: newPassword,
          fullname: fullname,
          phone: phone,
          adresse: address,
          image: imaget,
          type: type,
          last_login: last_login,
        },
      });
      const newAuthor = await prisma.author.create({
        data: {
          idProfile: newUser.id,
        },
      });

      // Based on the profile type, create and link the appropriate record
      switch (type) {
        case "club":
          await prisma.club.create({
            data: {
              author: {
                connect: { idAuthor: newAuthor.idAuthor },
              },
            },
          });
          break;
        case "responsableEvenement":
          await prisma.responsableEvenement.create({
            data: {
              author: {
                connect: { idAuthor: newAuthor.idAuthor },
              },
            },
          });
          break;
        case "administrator":
          await prisma.administrator.create({
            data: {
              author: {
                connect: { idAuthor: newAuthor.idAuthor },
              },
            },
          });
          break;
        case "dre":
          await prisma.dRE.create({
            data: {
              author: {
                connect: { idAuthor: newAuthor.idAuthor },
              },
            },
          });
          break;
        default:
          throw new Error("Invalid profile type");
      }

      resp
        .status(200)
        .send({ message: `The ${newUser.email} is connected successfully` });
      console.log("User saved");
    } catch (error) {
      resp.status(400).send({ message: error });
      console.error("Error saving:", error);
    } finally {
      await prisma.$disconnect(); // Disconnect Prisma client
    }
  }
  async getUsers(req: Request, resp: Response) {
    try {
      const getUsers = await prisma.profile.findMany();
      resp.status(200).json(getUsers);
    } catch (err) {
      throw err;
    }
  }

  async updateTokens(req: Request, resp: Response) {
    const { email }: { email: string } = req.body;

    try {
      // Retrieve the refresh token from the database
      const refreshTokenResult = await prisma.profile.findUnique({
        where: {
          email: email,
        },
        select: {
          refreshToken: true,
        },
      });

      // If no refresh token found, respond with error
      if (!refreshTokenResult) {
        return resp.status(403).json({ error: "" });
      }
      if (!refreshTokenResult || refreshTokenResult.refreshToken === null) {
        return resp.status(403).json({ error: "Refresh token not found" });
      }

      const refreshToken = refreshTokenResult.refreshToken;
      console.log(refreshToken);

      jwt.verify(refreshToken, jwtSecret, async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            console.log("Refresh token has expired");
            return resp
              .status(403)
              .json({ error: "Refresh token has expired" });
          } else {
            console.error("Refresh token verification error:", err.message);
            return resp
              .status(403)
              .json({ error: "Refresh token verification error" });
          }
        }

        // If refresh token is valid, generate a new access token
        const newAccessToken = jwt.sign(
          { email: email },
          jwtSecret,
          jwtOptionsAccess
        );

        // Send the new access token in the response
        resp.status(200).json({ accessToken: newAccessToken });
      });
    } catch (error) {
      console.error("Error fetching refresh token from database:", error);
      resp.status(500).json({ error: "Internal server error" });
    }
  }
}

//     // Verify the refresh token
