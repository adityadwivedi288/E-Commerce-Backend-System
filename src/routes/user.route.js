import express from 'express'
import { getUserProfile,updateProfile,getAllUser,blockUser,unBlockUser,deleteUser } from '../controllers/auth.controller.js'
import { verifyAccessToken,isAdmin } from '../middlewares/auth.middleware.js'
const router = express.Router();

router.get('/profile', verifyAccessToken, getUserProfile);
router.put('/updateUser-profile',verifyAccessToken,updateProfile)
router.get('/all-user', verifyAccessToken,isAdmin, getAllUser) // only admin check access 
router.put('/block-user/:id',verifyAccessToken,isAdmin,blockUser)
router.put('/unblock-user/:id',verifyAccessToken,isAdmin,unBlockUser)
router.delete('/delete-user/:id',verifyAccessToken,isAdmin,deleteUser)

export default router;