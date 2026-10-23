import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import { orderValidator, updateOrderStatusValidator } from '../validators/orderValidators.js';
import validate from '../middlewares/validate.js';

const router = Router();

router.use(protect); // Todas requieren autenticación

router.post('/', orderValidator, validate, createOrder);
router.get('/my-orders', getMyOrders);
router.get('/', restrictTo('admin'), getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', restrictTo('admin'), updateOrderStatusValidator, validate, updateOrderStatus);
router.delete('/:id', cancelOrder);

export default router;
