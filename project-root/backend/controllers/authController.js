import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../models/userModel.js";

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "ユーザーが存在しません" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "パスワードが違います" });

    const token = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "1h" });
    res.json({ message: "ログイン成功", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラー" });
  }
}
