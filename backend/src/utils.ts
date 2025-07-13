import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "./models/userModel";

export const generateToken = (user: User) => {
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "30d",
    }
  );
  return token;
};

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer xxxxx
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload & {
      _id: string;
      name: string;
      email: string;
      isAdmin: boolean;
      token: string;
    };
    req.user = decode;
    next();
  } else {
    res.status(401).json({ message: "No Token" });
  }
};
