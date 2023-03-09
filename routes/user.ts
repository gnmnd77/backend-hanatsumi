import express from "express";
import User from "../models/User";

type UserType = {
  _doc: {
    username: string;
    email: string;
    password: string;
    profileImage: string;
    coverImage: string;
    followers: any[];
    followings: any[];
    description?: string | undefined;
    city?: string | undefined;
    updatedAt: string;
  };
} | null;

const router = express.Router();

//ユーザー情報更新
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user: UserType = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      if (!user) return res.status(404).json("ユーザーが存在しません");
      return res.status(200).json("ユーザー情報が変更されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("他人のユーザー情報は変更できません");
  }
});

//ユーザー情報削除
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user: UserType = await User.findByIdAndDelete(req.params.id);

      return res.status(200).json("ユーザー情報が削除されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("他人のユーザー情報は削除できません");
  }
});

//ユーザー情報取得
router.get("/:id", async (req, res) => {
  try {
    const user: UserType = await User.findById(req.params.id);

    const { password, updatedAt, ...other } = user!._doc;
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default router;
