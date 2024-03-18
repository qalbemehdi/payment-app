import mongoose from "mongoose";

const transactionSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    moneySent:{
         type:Number,
         required:true
    },
    
        paymentStatus:{
            type:String,
            enum:['pending','completed','failed'],
            default:'pending'
        }
    
    
},{timestamps:true})
export const Transaction=mongoose.models.Transaction||mongoose.model("Transaction",transactionSchema)
