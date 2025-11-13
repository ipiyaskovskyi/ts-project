import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/index.js";

const authRouter = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || typeof firstname !== "string" || firstname.trim() === "") {
      return res.status(400).json({ error: "Firstname is required" });
    }

    if (!lastname || typeof lastname !== "string" || lastname.trim() === "") {
      return res.status(400).json({ error: "Lastname is required" });
    }

    if (!email || typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    const userResponse = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };

    res.status(201).json(userResponse);
    return;
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Password is required" });
    }

    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const userResponse = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };

    res.json(userResponse);
    return;
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

export default authRouter;

