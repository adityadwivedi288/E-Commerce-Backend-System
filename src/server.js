import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js'
import productRouter from './routes/product.route.js'
import addToCartRouter from './routes/cart.route.js'
import addToWishlist  from './routes/wishlist.routes.js';
import reviewProduct from './routes/review.routes.js'
import errorMiddleware from './middlewares/error.middleware.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173", // React frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();
//Routes Define
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/product',productRouter)
app.use('/api/v1/addCart',addToCartRouter)
app.use('/api/v1/addWishlist',addToWishlist)
app.use('/api/v1/review',reviewProduct)

app.get("/", (req, res) => {
  res.send("API is running...");
});
// Centralized Error Handler (must be after all routes)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
