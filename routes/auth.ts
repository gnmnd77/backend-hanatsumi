import express from "express";
import User from "../models/User";

const router = express.Router();

//新規登録
router.post("/register", async (req, res) => {
  try {
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const user = await newUser.save();
    return res.status(200).json(user);
  } catch {
    return res.status(500).json("このメールアドレスは既に登録されています");
  }
});

//ログイン
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).json("メールアドレスが登録されていません");

    const correctPassword = req.body.password === user?.password;
    if (!correctPassword)
      return res.status(404).json("パスワードが間違っています");

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default router;
