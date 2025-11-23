import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/register', async (req, res) => {
  await authController.register(req, res);
});

authRouter.post('/login', async (req, res) => {
  await authController.login(req, res);
});

export default authRouter;
