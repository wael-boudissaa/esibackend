import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import emailRoute from "./routes/emailRoute";
import events from "./routes/eventRoute";
import clubs from "./routes/clubRoute";

import actualite from "./routes/actualiteRouter";
import demande from "./routes/demandeRouter";

import authentificationRoute from "./routes/authentificationRoute";
import partenaire from "./routes/partenaireRoute";

dotenv.config();
const cors = require("cors");
const bodyParser = require("body-parser");

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PATCH",
    credentials: true,
  })
);

const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
app.use("/user", authentificationRoute);

app.use("/partenaire", partenaire);
app.use("/events", events);
app.use("/clubs", clubs);
app.use("/actualite", actualite);
app.use("/demande", demande);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});
// app.use("/email", emailRoute);

// app.post("/email", (req: Request, res: Response) => {
//   const sendEmail = async () => {};
//   sendEmail();
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
