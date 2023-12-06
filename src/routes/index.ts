import express from 'express';
import userRoutes from './userRoutes';
import postRoutes from './bookRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);

export default router;
