import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
export const generateRandomPassword = () => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < 14; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

class emailController {
  private _email: string;
  // private _password: string;

  constructor(email: string) {
    this._email = email;
  }

  get email(): string {
    return this._email;
  }

  set email(email: string) {
    this._email = email;
  }

  async generateMail(generatedMail: string, email: string) {
    let config = {
      service: "gmail",
      port: 2525,
      auth: {
        user: process.env.GMAIL_APP_USER, // your email address
        pass: process.env.GMAIL_APP_PASSWORD, // your password
      },
    };
    let transporter = nodemailer.createTransport(config);

    let message = {
      from: "esi.dz@esi.dz", // sender address
      to: email, // list of receivers
      subject: "Welcome to ESI Website!", // Subject line
      html: `${generatedMail}`, // html body
      // attachments: [
      //   // use URL as an attachment
      //   {
      //     filename: "receipt_test.pdf",
      //     path: "receipt_test.pdf",
      //     cid: "uniqreceipt_test.pdf",
      //   },
      // ],
    };
    try {
      let info = await transporter.sendMail(message);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}
export default emailController;
