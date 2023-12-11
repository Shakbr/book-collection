import express from 'express';
import { BookController } from '@/controllers/bookController';
import { protect } from '@/middlewares/authMiddleware';

const router = express.Router();
const controller = new BookController();

router.use(protect);
router.post('/', controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
