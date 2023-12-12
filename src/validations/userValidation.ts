import { body } from 'express-validator';

export const userCreationValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').notEmpty().withMessage('Email address is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const loginValidation = [
  body('email').notEmpty().withMessage('Email address is required'),
  body('password').notEmpty().withMessage('Password is required'),
];
