import express from "express";
import User from "../models/User";

type UserType = {
  _doc: {
    username: string;
    email: string;
    password: string;
    profileImage: string;
    coverImage: string;
    followers: string[];
    followings: string[];
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

//ユーザー情報削除
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

//ユーザーをフォロー
router.put("/:id/follow", async (req, res) => {
  if (req.params.id !== req.body.userId) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user?.followers.includes(currentUser?.id)) {
        await user?.updateOne({
          $push: {
            followers: currentUser?.id,
          },
        });

        await currentUser?.updateOne({
          $push: {
            followings: user?.id,
          },
        });

        return res.status(200).json("ユーザーをフォローしました");
      } else {
        return res.status(403).json("既にこのユーザーをフォローしています");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("あなた自身をフォローする事はできません");
  }
});

//フォロー解除
router.put("/:id/remove", async (req, res) => {
  if (req.params.id !== req.body.userId) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user?.followers.includes(currentUser?.id)) {
        await user?.updateOne({
          $pull: {
            followers: currentUser?.id,
          },
        });

        await currentUser?.updateOne({
          $pull: {
            followings: user?.id,
          },
        });

        return res.status(200).json("フォローを解除しました");
      } else {
        return res.status(403).json("このユーザーをフォローしていません");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("あなた自身をフォロー解除する事はできません");
  }
});

export default router;
