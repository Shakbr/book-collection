import { loginValidation, userCreationValidation } from './../validations/userValidation';
import { validationErrorHandler } from './../middlewares/validationErrorHandler';
import express from 'express';
import { UserController } from '../controllers/userController';

const router = express.Router();
const userController = new UserController();

// Public routes
router.post('/login', loginValidation, validationErrorHandler, userController.login);
router.post('/register', userCreationValidation, validationErrorHandler, userController.register);

export default router;
