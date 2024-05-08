import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import profileRouter from "./routes/profileRouter";
import emailRoute from "./routes/emailRoute";
import events from "./routes/eventRouter";

import authentificationRoute from "./routes/authentificationRoute";
// import { v4 as uuidv4 } from "uuid";
import partenaire from "./routes/partenaireRoute";

dotenv.config();
const cors = require("cors");
const bodyParser = require("body-parser");

// export function generateId(): string {
//   return uuidv4();
// }
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
    origin: "",
    methods: "GET,POST,PATCH",
    credentials: true,
  })
);
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
app.use("/user", authentificationRoute);

app.use("/partenaire", partenaire);
app.use("/events",events);

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
