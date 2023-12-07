import express from 'express';
import userRoutes from './userRoutes';
import bookRoutes from './bookRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/books', bookRoutes);

export default router;
