import express from "express";
import { verifyAccessToken } from '../middlewares/auth.middleware.js'
import { addToWishList,getWishlist,removeFromWishlist } from "../controllers/wishlist.controller.js";
const router = express.Router()

router.post('/add-wishlist',verifyAccessToken,addToWishList)
router.get('/get-product-fromWishlist',verifyAccessToken,getWishlist)
router.delete('/remove-productfrom-wishlist',verifyAccessToken,removeFromWishlist)

export default router