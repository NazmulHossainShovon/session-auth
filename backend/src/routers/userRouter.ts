import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { User, UserModel } from "../models/userModel";
import { isAuth } from "../utils";
import { io, userSocketMap } from "..";

export const userRouter = express.Router();
// POST /api/users/signin
userRouter.post(
  "/signin",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({
      email: req.body.email,
    }).lean<User>();
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const { _id, name, email } = user;
        if (_id) {
          req.session.user = { _id: _id.toString(), name, email };
        }
        res.json({
          user: {
            _id: user._id?.toString(),
            name: user.name,
            email: user.email,
          },
        });
        return;
      }
    }
    res.status(401).json({ message: "Invalid email or password" });
  })
);

userRouter.get(
  "/",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ name: req.query.userName });
    res.json(user);
  })
);

userRouter.get(
  "/current",
  asyncHandler(async (req: Request, res: Response) => {
    if (req.session.user) {
      const user = await UserModel.findById(req.session.user._id).select(
        "-password"
      );
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  })
);

userRouter.post(
  "/signup",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
      profileImage: req.body.image,
    });
    const { password, ...userExceptPassword } = user.toObject();
    req.session.user = userExceptPassword;
    res.json({
      user: userExceptPassword,
    });
  })
);

userRouter.post(
  "/signout",
  asyncHandler(async (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Failed to destroy session" });
      } else {
        res.json({ message: "Signed out successfully" });
      }
    });
  })
);

userRouter.put(
  "/friendRequest",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    await UserModel.findOneAndUpdate(
      { name: req.body.receiver },
      { $push: { receivedFriendReqs: req.body.sender } }
    );
    const updatedUser = await UserModel.findOneAndUpdate(
      { name: req.body.sender },
      { $push: { sentFriendReqs: req.body.receiver } },
      { new: true }
    ).select("-password");

    const receiverSocketId = userSocketMap.get(req.body.receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRequest", { from: req.body.sender });
    }

    res.json(updatedUser);
  })
);

userRouter.put(
  "/cancelRequest",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const updatedReceiver = await UserModel.findOneAndUpdate(
      { name: req.body.receiver },
      { $pull: { receivedFriendReqs: req.body.sender } },
      { new: true }
    ).select("-password");
    const updatedSender = await UserModel.findOneAndUpdate(
      { name: req.body.sender },
      { $pull: { sentFriendReqs: req.body.receiver } },
      { new: true }
    ).select("-password");

    res.json({ receiver: updatedReceiver, sender: updatedSender });
  })
);

userRouter.put(
  "/acceptRequest",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    await UserModel.findOneAndUpdate(
      { name: req.body.receiver },
      { $push: { friends: req.body.sender } }
    );
    await UserModel.findOneAndUpdate(
      { name: req.body.sender },
      { $push: { friends: req.body.receiver } }
    );
    const updatedUser = await UserModel.findOneAndUpdate(
      { name: req.body.receiver },
      { $pull: { receivedFriendReqs: req.body.sender } },
      { new: true }
    ).select("-password");
    await UserModel.findOneAndUpdate(
      { name: req.body.sender },
      { $pull: { sentFriendReqs: req.body.receiver } }
    );

    res.json(updatedUser);
  })
);

userRouter.put(
  "/unfriend",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const updatedUser = await UserModel.findOneAndUpdate(
      { name: req.body.user1 },
      { $pull: { friends: req.body.user2 } },
      { new: true }
    ).select("-password");
    await UserModel.findOneAndUpdate(
      { name: req.body.user2 },
      { $pull: { friends: req.body.user1 } }
    );

    res.json({ message: "successfully unfriend", currentUser: updatedUser });
  })
);
