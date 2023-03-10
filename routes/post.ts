import express from "express";
import Post from "../models/Post";
import User from "../models/User";

const router = express.Router();

//新規投稿
router.post("/", async (req, res) => {
  const post = await new Post(req.body);
  try {
    const savedPost = await post.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//投稿更新
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post?.userId === req.body.userId) {
      await post?.updateOne({
        $set: req.body,
      });

      return res.status(200).json("投稿を編集しました");
    } else {
      return res.status(403).json("自分以外の投稿は編集できません");
    }
  } catch (err) {
    res.status(403).json(err);
  }
});

//投稿削除
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post?.userId === req.body.userId) {
      await post?.deleteOne();

      return res.status(200).json("投稿を削除しました");
    } else {
      return res.status(403).json("自分以外の投稿は削除できません");
    }
  } catch (err) {
    return res.status(403).json(err);
  }
});

//投稿単体取得
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    res.status(200).json(post);
  } catch (err) {
    res.status(403).json(err);
  }
});

//いいね機能
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if (!post?.likes.includes(currentUser?.id)) {
      await post?.updateOne({
        $push: {
          likes: currentUser?.id,
        },
      });

      return res.status(200).json("投稿にいいねをしました");
    } else {
      await post?.updateOne({
        $pull: {
          likes: currentUser?.id,
        },
      });

      return res.status(200).json("いいねを取り消しました");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default router;
