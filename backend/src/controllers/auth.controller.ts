import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const validation = registerSchema.safeParse(req.body);
      if (!validation.success) {
        const firstError = validation.error.errors[0];
        const errorMessage = firstError?.message || "Validation failed";
        res.status(400).json({
          error: errorMessage,
        });
        return;
      }

      const data = validation.data;
      const user = await authService.register(data);
      res.status(201).json(user);
      return;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "User with this email already exists"
      ) {
        res.status(409).json({ error: error.message });
        return;
      }
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        const firstError = validation.error.errors[0];
        const errorMessage = firstError?.message || "Validation failed";
        res.status(400).json({
          error: errorMessage,
        });
        return;
      }

      const data = validation.data;
      const user = await authService.login(data);
      res.json(user);
      return;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Invalid email or password"
      ) {
        res.status(401).json({ error: error.message });
        return;
      }
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  }
}
