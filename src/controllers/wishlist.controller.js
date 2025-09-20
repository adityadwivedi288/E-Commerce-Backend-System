import WishList from "../models/wishlist.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/product.model.js";

// add product in wishlist
const addToWishList = asyncHandler(async(req,res)=>{
    const {productId} = req.body;
    const userId = req.user._id;
    //console.log(userId);
    const product = await Product.findById(productId); //kya pahle se wishlist bna hai 
    if(!product){
        throw new ApiError(400,"product not found")
    }
    let wishlist = await WishList.findOne({user:userId});
      if(wishlist){
        if(wishlist.products.includes(productId)){
        return res
        .status(200)
        .json(new ApiResponse(200,"Product allready exist in wishlist"))
    }
    wishlist.products.push(productId)
  }else{
    wishlist = new WishList({
      user: userId,
      products: [productId],
    });
  }
  await wishlist.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Product added to wishlist", { wishlist }));
})

// Get wishlist
  const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
 // console.log(userId);
  const wishlist = await WishList.findOne({ user: userId }).populate(
    "products",
    "title price"
  );
  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Wishlist fetched successfully", { wishlist }));
});

// remove from wishlit
  const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  const wishlist = await WishList.findOne({ user: userId });
  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId
  );

  await wishlist.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Product removed from wishlist", { wishlist }));
});


export{
    addToWishList,
    getWishlist,
    removeFromWishlist
}

