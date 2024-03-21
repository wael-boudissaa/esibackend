import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const generateRandomPassword = () => {
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
  async sendPartenaire(req: Request, res: Response) {
    let config = {
      service: "gmail",
      port: 2525,
      // your email domain
      auth: {
        user: process.env.GMAIL_APP_USER, // your email address
        pass: process.env.GMAIL_APP_PASSWORD, // your password
      },
    };
    let transporter = nodemailer.createTransport(config);

    let message = {
      from: "esi.dz@esi.dz", // sender address
      to: req.body.email, // list of receivers
      subject: "Welcome to ESI Website!", // Subject line
      html: `<h2>Congratulations on Becoming a Partner!</h2>
 <p>
          Dear [Partner Name],
      </p>
      
      <p>
          We are thrilled to inform you that your application to become a partner with our platform has been accepted! Welcome aboard!
      </p>
      
      <p>
          As a valued partner, you now have access to exclusive features and resources on our platform.
      </p>
      
      <p>
          Here are your login credentials to authenticate to the platform:
      </p>
      
      <ul>
          <li><strong>Email:</strong> ${req.body.email}</li>
          <li><strong>Password:</strong> ${generateRandomPassword()}</li>
      </ul>
      
      <p>
          Please use the provided credentials to log in to our platform and explore the available features. We look forward to collaborating with you!
      </p>
      
      <p>
          If you have any questions or need assistance, feel free to contact our support team at [Support Email].
      </p>
      
      <p>
          Best regards,<br>
          [Your Organization Name]
      </p>`, // html body
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
      res.status(200).send({
        msg: "Email sent",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    } catch (error) {
      console.error("Error sending email:", error);
      res
        .status(500)
        .send({ error: "An error occurred while sending the email." });
    }
  }
}
export default emailController;
