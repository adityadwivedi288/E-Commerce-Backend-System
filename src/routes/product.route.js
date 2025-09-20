import express from 'express'
import {createProduct,getAllProduct,getSingleProduct,updateProduct,deleteProduct } from '../controllers/product.controller.js'
import { verifyAccessToken,isVendorOrAdmin } from '../middlewares/auth.middleware.js'
import upload from '../middlewares/localUpload.middleware.js';
const router = express.Router();

router.post("/create-product",verifyAccessToken,isVendorOrAdmin,upload.single("image"),createProduct); 
router.get("/get-all-product", getAllProduct);
router.get("/get-single-product/:id", getSingleProduct);
router.put("/update-product/:id",verifyAccessToken,isVendorOrAdmin,updateProduct);
router.delete( "/delete-product/:id", verifyAccessToken,isVendorOrAdmin,deleteProduct
);

export default router;

