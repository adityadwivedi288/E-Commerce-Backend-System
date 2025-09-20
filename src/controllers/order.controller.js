import Order from "../models/order.model";
import Cart from "../models/cart.model";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

const placeOrder = asyncHandler(async(req,res)=>{
    const {userId} = req.user._id;
    const cart = await Cart.findOne({user:userId}).populate("items.products");
    if(!cart){
        throw  new ApiError(400,'Cart not found');
    }
    const {Address,phone,pinecode, paymentMethod} = req.body;
    if(!Address || !phone || !pinecode || !paymentMethod){
        throw new ApiError(400,"All field are required"); 
    }

    // 3. Prepare product details for order
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    // 4. Calculate total price
    const totalPrice = orderItems.reduce(
      (acc, curr) => acc + curr.quantity * curr.price,
      0
    );

    // 5. Create new order
    const order = await Order.create({
      user: userId,
      products: orderItems,
      shippingInfo: { Address, phone, pinecode },
      totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === "ONLINE" ? "pending" : "paid",
    });

    // 6. Empty user cart after order placed
    cart.items = [];
    await cart.save();
    return res
    .status(200)
    .json(new ApiResponse(200,"order placed SucessFully",{order}))
})

export default  placeOrder;
