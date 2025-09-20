import Review from "../models/review.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Product from "../models/product.model.js";

const addReview = asyncHandler(async(req,res)=>{
    const {productId,rating,comment} = req.body;
    const userId = req.user._id;
    if (!productId || !rating || !comment) {
    throw new ApiError(400, "ProductId, rating & comment are required");
    }
    const product = await Product.findById(productId);
    if (!product) {
    throw new ApiError(404, "Product not found");
    }
    const alreadyReviwed = await Review.findOne({user:userId,product:productId})
    if(alreadyReviwed) {
        throw new ApiError(400,"You have already review this product")
    }
    const review = await Review.create({
        user:userId,
        product:productId,
        rating,
        comment,
    })
    if(!review){
        throw new ApiError(400,"review not created")
    }
    const reviews = await Review.find({ product: productId }); // use product ka all review fetch kro
    let avgRating = 0;
    if (reviews.length > 0) {
      avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
    }
    const newReview = await Product.findByIdAndUpdate(
    productId,
   {
    rating: avgRating.toFixed(1),
    numOfReviews: reviews.length
  },
  { new: true, runValidators: false } 
 );
    return res
    .status(200)
    .json(new ApiResponse(200,"Review added successfully",{ newReview }))
  })

// Get All Reviews
const getAllRewiew = asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        throw new ApiError(400,"Product Not Found");
    }
    const reviews =await Review.find({product}).populate("user","name email").populate("product", "title price").sort({ createdAt: -1 }); // sort({ createdAt: -1 }) eska matlab latest review sabse pahle do
    if (reviews.length === 0) {
      throw new ApiError(404, "No reviews found for this product");
    }
    return res
    .status(200)
    .json(new ApiResponse(200,"Get all review fetch SucessFully",{reviews}))
})

// Delete Reviews
const deleteReview = asyncHandler(async(req,res)=>{
    const {reviewId} = req.params;
    const userId = req.user._id;
    const review = await Review.findById(reviewId);
   console.log("ReviewId:", reviewId);
   console.log("Review:", review);
    if(!review){
        throw new ApiError(400,"reviews not found")
    }

    if(review.user.toString() !==userId.toString()){
        throw new ApiError(400,"You are not allowed to delete this review")
    }
    await Review.findByIdAndDelete(reviewId);

     // Recalculate average rating
    const reviews = await Review.find({product:review.product});
     const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
      : 0;
    const product = await Product.findById(review.product)
    if(!product){
        throw new ApiError(400,"product not found");
    }
    product.rating = avgRating.toFixed(1); // decimal ke saath string aayega
    product.numOfReviews = reviews.length;
    const updatedProduct = await product.save({ validateBeforeSave: false });
    return res
    .status(200)
    .json(new ApiResponse(200,"Review Delete SucessFully",{updatedProduct}))
})


export {
    addReview,
    getAllRewiew,
    deleteReview
}
