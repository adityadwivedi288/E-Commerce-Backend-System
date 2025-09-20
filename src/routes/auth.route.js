import express from 'express';          
import { signup,loginUser,refreshAccessToken,logoutUser } from '../controllers/auth.controller.js';
import { verifyAccessToken } from '../middlewares/auth.middleware.js';
const router = express.Router(); 

router.post('/signup', signup); 
router.post('/login', loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logoutUser);

export default router;  
