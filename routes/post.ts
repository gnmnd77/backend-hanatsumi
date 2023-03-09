import express from "express";
import Post from "../models/Post";

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

export default router;
