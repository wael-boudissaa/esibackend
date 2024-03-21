import { Router } from "express";

import emailController from "../controllers/emailController";
const EmailController = new emailController();
const route = Router();
route.post("/pa", EmailController.sendPartenaire);

export default route;
