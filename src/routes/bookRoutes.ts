import express from 'express';
import { BookController } from '../controllers/BookController';

const router = express.Router();
const controller = new BookController();

router.post('/', controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
