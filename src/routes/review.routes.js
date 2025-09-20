import express from "express";
import { verifyAccessToken ,isCustomer} from "../middlewares/auth.middleware.js";
import { addReview, deleteReview, getAllRewiew } from "../controllers/review.controller.js";

const router = express.Router()

router.post('/add-review',verifyAccessToken,isCustomer,addReview)
router.get('/get-all-reviews/:id',verifyAccessToken,getAllRewiew)
router.delete('/review-delete/:reviewId',verifyAccessToken,isCustomer,deleteReview)
export default router;