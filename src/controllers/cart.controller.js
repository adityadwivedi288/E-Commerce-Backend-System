import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const addToCart = asyncHandler(async(req,res)=>{
    const {productId,quantity} = req.body
    const userId = req.user._id
    const product = await Product.findById(productId)
    if(!product){
        throw new ApiError(400,"product not found")
    }
    let cart = await Cart.findOne({user:userId})
    if(cart){
        const itemIndex = cart.items.findIndex((item)=>item.product.toString()===productId)
        if(itemIndex > -1){
            cart.items[itemIndex].quantity +=quantity; 
        }
        else{
            cart.items.push({ product: productId, quantity });
        }
    } 
    else{
        cart = new Cart({
            user:userId,
            items:[{product:productId,quantity}]
        })
    }
    await cart.save();
    return res
    .status(200)
    .json(new ApiResponse(200,"New Product Create SucessFully",{cart}))
})

// get Cart
const getCart = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const cart = await Cart.findOne({user:userId}).populate("items.product","title price");
    if(!cart){
        throw new ApiError(400,"Cart not found");
    }
    return res 
    .status(200)
    .json(new ApiResponse(200,"get cart sucesFully",{cart}))

})

// update cart
  const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id; 

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );
  if (itemIndex === -1) {
    throw new ApiError(404, "Product not found in cart");
  }
  cart.items[itemIndex].quantity = quantity; 
  const newUpdateCartItem = await cart.save(); // command line argument 
  return res
  .status(200)
  .json(new ApiResponse(200,"cart update SucessFully",{newUpdateCartItem}));
});


// remove item from cart (only single product delete)
 const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId }); 
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );
  const removeItem = await cart.save();
  return res
  .status(200)
  .json(new ApiResponse(200,"Product Remove SucessFully",{removeItem}))
});

// clear card yani card too rhega but uske andar sara product delete ho jeyga
  const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  cart.items = []; 
  await cart.save();
  return res
  .status(200)
  .json(new ApiResponse(200, "Cart cleared successfully", { cart })
  );
});

// Delete Cart( user ka all cart delete ho gya hai)
  const deleteCartCompletely = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const deletedCart = await Cart.findOneAndDelete({ user: userId });
  if (!deletedCart) {
    throw new ApiError(404, "Cart not found");
  }
  return res
  .status(200)
  .json( new ApiResponse(200, "Cart deleted completely")
  );
});

// remove multiple product from items
  const removeMultipleCartItems = asyncHandler(async (req, res) => {
  const { productIds } = req.body;
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found"); 
  }
  cart.items = cart.items.filter(
    (item) => !productIds.includes(item.product.toString())
  );
  const updatedCart = await cart.save();
  return res.status(200).json(
    new ApiResponse(200, "Selected Products Removed Successfully", {
      cart: updatedCart,
    })
  );
});


export {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    deleteCartCompletely,
    removeMultipleCartItems
}






