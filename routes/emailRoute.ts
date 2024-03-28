import { Router } from "express";

import emailController from "../controllers/emailController";
const email = "new";
const password = "new";
const EmailController = new emailController(email, password);
const route = Router();
route.post("/pa", EmailController.generateMail);

export default route;
