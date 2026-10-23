import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import { body } from 'express-validator';
import validate from '../middlewares/validate.js';

const router = Router();

const categoryValidator = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('description').optional().trim(),
];

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', protect, restrictTo('admin'), categoryValidator, validate, createCategory);
router.put('/:id', protect, restrictTo('admin'), categoryValidator, validate, updateCategory);
router.delete('/:id', protect, restrictTo('admin'), deleteCategory);

export default router;
