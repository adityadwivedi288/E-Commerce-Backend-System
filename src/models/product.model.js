import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
 {
   title:{
     type:String,
     required:true,
     trim:true
   },

   description:{
    type:String,
    required:true
   },

   price:{
    type:Number,
    required:true
   },

   category:{
    type:String,
    required:true
   },

   stock:{
    type:Number,
    default:1
   },
   
   image:{
    type:String,
    required:true
   },

   vendor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   rating: {
  type: Number,
  default: 0,
  },

  numOfReviews: {
  type: Number,
  default: 0,
  },
  
},
{timestamps:true})

 const Product = mongoose.model("Product",productSchema)
 export default Product;