import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },

        products:[
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Product"
                },
                quantity:{
                    type:Number,
                    required:true
                },
                price:{
                    type:Number,
                    required:true
                },
            },
        ],
        shippingInformation:{
            Address:{
                type:String,
                required:true,
            },
            phone:{
                type:String,
                required:true,
            },
            pincode:{
                type:String,
                required:true,
            },
        },

        totalPrice:{
            type:String,
            required:true,
        },
        paymentMethod:{
            type:String,
            enum:["COD","ONLINE PAYMENT"],
            default:"COD",
        },
        orderStatus:{
            type:String,
            enum:["processing","shipped","Delivered"],
            default:"processing"
        },
    },
 {timeseries:true})

 const Order = mongoose.model("Order",orderSchema)
 export default Order;