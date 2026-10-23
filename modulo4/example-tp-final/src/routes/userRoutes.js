import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import { updateUserValidator } from '../validators/userValidators.js';
import validate from '../middlewares/validate.js';

const router = Router();

router.use(protect); // Todas las rutas requieren autenticación

router.get('/', restrictTo('admin'), getAllUsers);
router.get('/:id', restrictTo('admin'), getUserById);
router.put('/:id', updateUserValidator, validate, updateUser);
router.delete('/:id', restrictTo('admin'), deleteUser);

export default router;
