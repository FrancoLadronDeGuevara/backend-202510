import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import { productValidator, updateProductValidator } from '../validators/productValidators.js';
import validate from '../middlewares/validate.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', protect, restrictTo('admin'), productValidator, validate, createProduct);
router.put('/:id', protect, restrictTo('admin'), updateProductValidator, validate, updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

export default router;
