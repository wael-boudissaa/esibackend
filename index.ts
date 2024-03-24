import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import profileRouter from "./routes/profileRouter";
import emailRoute from "./routes/emailRoute";
dotenv.config();
const cors = require("cors");
const bodyParser = require("body-parser");

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  cors({
    origin: "",
    methods: "GET,POST,PATCH",
    credentials: true,
  })
);
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});
app.use("/email", emailRoute);

app.post("/email", (req: Request, res: Response) => {
  const sendEmail = async () => {};
  sendEmail();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});