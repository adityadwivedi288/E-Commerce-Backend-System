import  Product  from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinary from "../utils/cloudinary.js";
import fs from 'fs';

// create product
const createProduct = asyncHandler(async(req,res)=>{  
    const {title, description, price, category, stock} = req.body
    if(!title || !description || !price || !category || !stock){
        throw new ApiError(403,"All Field are Required")
    }
    if(!req.file){
        throw new ApiError(400,"Product Image is required")
    }
    // upload on cloudinary
    const result = await cloudinary.uploader.upload(req.file.path,{
        folder:"ecommerce-product",
    })
    const imageUrl = result.secure_url;
    // Delete Local File
    fs.unlinkSync(req.file.path)

    const product = await Product.create({
        title,
        description,
        price,
        category,
        stock,
        vendor:req.user._id , // id generate from token
        image:imageUrl,
    })

    const populateProduct = await Product.findById(product._id).populate("vendor", "name email")
    return res
    .status(200)
    .json(new ApiResponse(200,{product:populateProduct},"Product Create SucessFully",))

})

// get all product 
 const getAllProduct = asyncHandler(async(req,res)=>{
    const product = await Product.find().populate("vendor","name email");
    if(!product){
        throw new ApiError(400,"product not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,{product},"All Product Fetch SucessFully"))
 })

// get single product
const getSingleProduct = asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id).populate("vendor","name email")
    if(!product){
        throw new ApiError(400,"Single product not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,{product},"Single Product Fetch SucessFully"))
}) 

//update  product
const updateProduct = asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        throw new ApiError(400,"user not found")
    }
    if(req.user.role==="vendor" && product.vendor.toString() !== req.user._id.toString()){
        throw new ApiError(400,"You can only update your own Product")
    }
     const newProduct = Object.assign(product, req.body); // Update body data into product
     const updateProduct =  await newProduct.save();
     return res
     .status(200)
     .json(new ApiResponse(200,{updateProduct},"Product Update SucessFully"))
})

//deletaProduct
const deleteProduct = asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        throw new ApiError(400,"Product not Found")
    }
    if(req.user.role==="vendor" && product.vendor.toString() !== req.user._id.toString()){
        throw  new ApiError(400,"You can only delete your own product")
    }
    const newDelete= await product.deleteOne()
    return res
    .status(200)
    .json(new ApiResponse(200,"Product Delete SucessFully"))

})

export{createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct
}
