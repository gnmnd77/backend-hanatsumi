import express from "express";
import User from "../models/User";

const router = express.Router();

//プロフィール更新
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
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

//アカウント削除
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      return res.status(200).json("ユーザー情報が削除されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("他人のユーザー情報は削除できません");
  }
});

export default router;
