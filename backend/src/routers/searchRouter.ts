import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { UserModel } from "../models/userModel";

export const searchRouter = express.Router();

searchRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const users = await UserModel.find({
      name: { $regex: req.query.query, $options: "i" },
    });
    res.json(users);
  })
);
