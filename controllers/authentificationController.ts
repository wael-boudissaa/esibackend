import { Request, Response } from "express";
// import User from "../models/userModels";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RequestBody {
  email: string;
  password: string;
}
const createAccesToken = (id: string, type: string) => {
  return jwt.sign({ id: id, type: type }, "accesbaba", { expiresIn: "15min" });
};
function createRefreshToken(id : string, type : string, expiresIn = "1d") {
  const payload = {
    id: id,
    type: type,
  };
}
interface JwtOptions {
  expiresIn: string | number;
}

const ROUND: string | number = (process.env.KEY_ROUND as string) || 10;

const jwtSecret: string =
  (process.env.JWT_SECRET as string) || "1VSDQ44BR6ER6486T1E61QNT6NT46N84Q";

export const register = async (req: Request, resp: Response) => {
  const { email, password }: RequestBody = req.body;

  if (!email) {
    resp.status(400).send({ message: "Please enter an email address" });
    console.log("email is required");
  }

  if (!password) {
    resp.status(400).send({ message: "Please enter a password" });
    console.log("password is required");
  }

  const newPassword = await bcrypt.hash(password, ROUND);

  // const findUser = await User.find({ email: email }); // !!!!!!!!!!!!!!!!!    Verifier ther is no email existed

  // if (findUser.length > 0) {
  //   resp.status(400).send({ message: "email already in use" });
  //   return;
  // }
  const jwtOptions: JwtOptions = {
    expiresIn: "1h",
  };

  const token = jwt.sign({ email: email }, jwtSecret, jwtOptions);

  console.log(token);

  // const newUser = new User({
  //   email: email,
  //   password: newPassword,
  //   isAdmin: false,
  //   havePicture: false,
  //   userToken: token,
  //   timeCreateToken: Date.now(),
  // });
  // !!!!!!!!!!!!!!!!!!!!!!!!!!Creer user
  // try {
  //   await newUser.save();
  //   resp.cookie("token", token, { httpOnly: true, secure: true });
  //   resp
  //     .status(200)
  //     .send({ message: `the ${newUser.email} is connected successfully` });
  //   console.log("User saved");
  // } catch (error) {
  //   resp.status(400).send({ message: "error saving user" });
  //   console.log("Error saving" + error);
  // }
};

export const login = async (req: Request, resp: Response) => {
  const { email, password }: RequestBody = req.body;

  if (!email) {
    resp.status(400).send({ message: "Please enter an email address" });
    console.log("email is required");
  }

  if (!password) {
    resp.status(400).send({ message: "Please enter a password" });
    console.log("password is required");
  }

  // let newUser = await User.find({ email: email }); //!!! Verifier si l'email existe

  // const hashPassword = await bcrypt.compare(password, newUser[0].password); // !!!! Verifier si mot passe juste

  // if (hashPassword) {
  //   const jwtOptions: JwtOptions = {
  //     expiresIn: 10000,
  //   };
  //   const token = jwt.sign({ email: email }, jwtSecret, jwtOptions);
  //   const updateUser = await User.findOneAndUpdate(
  //     { email: email },
  //     { userToken: token, timeCreateToken: Date.now() },
  //     { new: true }
  //   ); //!! Generate A new token and Sign in with update the user information ((date derniere inscription ))
  // console.log(updateUser);
  // resp.cookie("token", token, { httpOnly: true, secure: true });
  //   resp.status(200).send({ message: "user exists" });
  // } else {
  //   resp.status(200).send({ message: "password does not match" });
  // }
  //!! Verifier password
  // ??? Update refresh token on the database and create new acces token 
};

export const updateTokens = async (req:Request , res: Response) =>{
  // !! Refresh token in database
 // !! Verifying the the refresh token isnt expired
  // jwt.verify(
  //   refreshTokenresult[0].refreshToken,
  //   "refreshbaba",
  //   (err, decoded) => {
  //     if (err) {
  //       if (err.name === "TokenExpiredError") {
  //         console.log("Refresh token has expired");
  //         return res.status(403).json({ error: "Refresh token has expired" });
  //       } else {
  //         console.error("Refresh token verification error:", err.message);
  //         return res
  //           .status(403)
  //           .json({ error: "Refresh token verification error" });
  //       }
  //     }})
// !! Generate a new acces token 
}
