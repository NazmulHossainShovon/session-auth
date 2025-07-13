import { NextFunction, Request, Response } from "express";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
