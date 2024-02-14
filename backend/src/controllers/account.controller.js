import mongoose from "mongoose";
import { Account } from "../models/account.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Transaction } from "../models/transaction.model.js";

export const getUserAccount=asyncHandler(async(req,res)=>{
    
    const account=await Account.findOne({userId:req.user?._id}).populate("userId","name email avatar createdAt")
    if(!account)
     throw new ApiError(500,"Server down:can't fetch details")
    return ApiResponse.send(res,200,account,"account details fetched successfully")
})

export const transferMoney=asyncHandler(async(req,res)=>{
    const {to,amount}=req.query;
    console.log(amount);
    const senderAccount=await Account.findOne({userId:req.user?._id})
    if(senderAccount.balance<=amount)
    throw new ApiError(400,"insufficient balance")
    
    const recieverAccount=await Account.findOne({userId:to})
    if(!recieverAccount)
    throw new ApiError(400,"Invalid account")

    const atomSession=await mongoose.startSession();
    atomSession.startTransaction();

    // Perform the transfer
    await Account.updateOne({userId:req.user._id},{$inc:{balance:-amount}}).session(atomSession)
    await Account.updateOne({userId:to},{$inc:{balance:amount}}).session(atomSession)
    
    let transaction = new Transaction({
        senderId: req.user._id,
        receiverId: to,
        moneySent: amount
    });
    
   transaction= await transaction.save({session:atomSession});

    // commit Session
    await atomSession.commitTransaction()

    return ApiResponse.send(res,200,transaction,"money transferred successfully")

})

export const getUserTransactions=asyncHandler(async(req,res)=>{

    const transactions=await Transaction.find({senderId:req.user._id},{senderId:1,receiverId:1,moneySent:1}).populate("senderId receiverId","name -_id").sort({createdAt:-1})

    return ApiResponse.send(res,200,transactions,"transactions fetched successfully")
})