import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class profileController {
  async getAllUsers(req: Request, res: Response) {
    const users = await prisma.profile.findMany();
    res.json(users);
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await prisma.profile.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    res.json(user);
  }

  async createUser(req: Request, res: Response) {
    const { username, email } = req.body;
    const newUser = await prisma.profile.create({
      data: {
        username,
        email,
      },
    });
    res.json(newUser);
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { username, email } = req.body;
    const updatedUser = await prisma.profile.update({
      where: {
        id: parseInt(id),
      },
      data: {
        username,
        email,
      },
    });
    res.json(updatedUser);
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    await prisma.profile.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.sendStatus(204);
  }
}

export default profileController;
