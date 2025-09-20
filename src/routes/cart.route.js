import express from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import {
      addToCart,
      getCart,
      removeCartItem,
      updateCartItem,
      clearCart,
      deleteCartCompletely,
      removeMultipleCartItems
    } from "../controllers/cart.controller.js"

const router = express.Router()
router.post('/add-to-cart',verifyAccessToken, addToCart)
router.get('/get-cart',verifyAccessToken, getCart)
router.put('/update-cart-item',verifyAccessToken,updateCartItem)
router.delete('/removeSingleProduct-cart-item',verifyAccessToken,removeCartItem)
router.delete('/all-Product-remove-from-cart',verifyAccessToken,clearCart )
router.delete('/remove-Cart-compleletly',verifyAccessToken,deleteCartCompletely)
router.delete('/remove-MultipleProductFrom-Item',verifyAccessToken, removeMultipleCartItems)

export default router;