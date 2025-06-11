import express from 'express';
import { getUsers,Register,Login, Logout, adminLogin} from '../controller/Users.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { RefreshToken } from '../controller/RefreshToken.js';


const router = express.Router();

router.get('/users',  verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', RefreshToken);
router.delete('/logout', Logout);
router.post('/admin',adminLogin)


export default router;