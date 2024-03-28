import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { profile } from "console";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface JwtOptions {
  expiresIn: string | number;
}
const jwtSecret: string =
  (process.env.JWT_SECRET as string) || "1VSDQ44BR6ER6486T1E61QNT6NT46N84Q";
const createAccesToken = (id: string, type: string) => {
  return jwt.sign({ id: id, type: type }, "accesbaba", { expiresIn: "15min" });
};
const createRefreshToken = (id: string, type: string, expiresIn = "1d") => {
  const payload = {
    id: id,
    type: type,
  };
};
export class authentificationController {
  async login(req: Request, resp: Response) {
    const { email, password }: RequestBody = req.body;

    if (!email) {
      resp.status(400).send({ message: "Please enter an email address" });
      console.log("email is required");
    }

    if (!password) {
      resp.status(400).send({ message: "Please enter a password" });
      console.log("password is required");
    }

    try {
      const user = await prisma.profile.findUnique({ where: { email: email } });

      if (!user) {
        return resp.status(401).send({ message: "User not found" });
      }
      //!!! Verifier si l'email existe
      const hashPassword1 = await bcrypt.hash(password, ROUND);

      const hashPassword = await bcrypt.compare(password, user.password);
      // !!!! Verifier si mot passe juste

      if (hashPassword) {
        const jwtOptions: JwtOptions = {
          expiresIn: 10000,
        };
        const token = jwt.sign({ email: email }, jwtSecret, jwtOptions);
        // const updateUser = await prismaprofile.findOneAndUpdate(
        //   { email: email },
        //   { userToken: token, timeCreateToken: Date.now() },
        //   { new: true }
        // );
        //!! Generate A new token and Sign in with update the user information ((date derniere inscription ))
        // console.log(updateUser);
        resp.cookie("token", token, { httpOnly: true, secure: true });
        resp.status(200).send({ message: "Login successful" });
      } else {
        resp
          .status(200)
          .send({ message: "password does not match", hashPassword });
      }
      //!! Verifier password
      // ??? Update refresh token on the database and create new acces token
    } catch (error) {
      console.error("Error occurred during login:", error);
      return resp.status(500).send({ message: "Internal server error" });
    }
  }
}

interface RequestBody {
  email: string;
  password: string;
}

const ROUND: number = process.env.KEY_ROUND
  ? parseInt(process.env.KEY_ROUND, 10)
  : 10;

// export const register = async (req: Request, resp: Response) => {
//   const { email, password }: RequestBody = req.body;

//   if (!email) {
//     resp.status(400).send({ message: "Please enter an email address" });
//     console.log("email is required");
//   }

//   if (!password) {
//     resp.status(400).send({ message: "Please enter a password" });
//     console.log("password is required");
//   }

//   const newPassword = await bcrypt.hash(password, ROUND);

//   // const findUser = await User.find({ email: email }); // !!!!!!!!!!!!!!!!!    Verifier ther is no email existed

//   // if (findUser.length > 0) {
//   //   resp.status(400).send({ message: "email already in use" });
//   //   return;
//   // }
//   const jwtOptions: JwtOptions = {
//     expiresIn: "1h",
//   };

//   const token = jwt.sign({ email: email }, jwtSecret, jwtOptions);

//   console.log(token);

//   // const newUser = new User({
//   //   email: email,
//   //   password: newPassword,
//   //   isAdmin: false,
//   //   havePicture: false,
//   //   userToken: token,
//   //   timeCreateToken: Date.now(),
//   // });
//   // !!!!!!!!!!!!!!!!!!!!!!!!!!Creer user
//   // try {
//   //   await newUser.save();
//   //   resp.cookie("token", token, { httpOnly: true, secure: true });
//   //   resp
//   //     .status(200)
//   //     .send({ message: `the ${newUser.email} is connected successfully` });
//   //   console.log("User saved");
//   // } catch (error) {
//   //   resp.status(400).send({ message: "error saving user" });
//   //   console.log("Error saving" + error);
//   // }
// };

// export const updateTokens = async (req:Request , resp: Response)=>{
// }
//   !! Refresh token in database
//  !! Verifying the the refresh token isnt expired
//   jwt.verify(
//     refreshTokenresult[0].refreshToken,
//     "refreshbaba",
//     (err, decoded) => {
//       if (err) {
//         if (err.name === "TokenExpiredError") {
//           console.log("Refresh token has expired");
//           return res.status(403).json({ error: "Refresh token has expired" });
//         } else {
//           console.error("Refresh token verification error:", err.message);
//           return res
//             .status(403)
//             .json({ error: "Refresh token verification error" });
//         }
//       }
// !! Generate a new acces token

// controllers/authentificationController.ts

// export class authentificationController {
//   // Controller logic here
// }

// export default authentificationController;
