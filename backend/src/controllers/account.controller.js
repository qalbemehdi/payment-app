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
    const { to, amount } = req.query;
    const senderAccount = await Account.findOne({ userId: req.user?._id });
    if (!senderAccount || senderAccount.balance < amount) {
        throw new ApiError(400, "Insufficient balance or invalid sender account");
    }
    
    const receiverAccount = await Account.findOne({ userId: to });
    if (!receiverAccount) {
        throw new ApiError(400, "Invalid receiver account");
    }

    const atomSession=await mongoose.startSession();
    atomSession.startTransaction();

    try {
        // Update sender and receiver account balances
        await Account.updateOne({userId:req.user._id},{$inc:{balance:-amount}}).session(atomSession)
        await Account.updateOne({userId:to},{$inc:{balance:amount}}).session(atomSession)

        // Create a new transaction record
        let transaction = new Transaction({
            senderId: req.user._id,
            receiverId: to,
            moneySent: amount,
            paymentStatus:'completed'
        });
        
       transaction= await transaction.save({session:atomSession});

        // Commit the transaction
        await atomSession.commitTransaction();

        return ApiResponse.send(res, 200, transaction, "Money transferred successfully");
    } catch (error) {
        // If an error occurs, abort the transaction
        await atomSession.commitTransaction()

        // Update payment status to "failed" in case of error
        await Transaction.updateOne(
            { senderId: req.user._id, receiverId: to, moneySent: amount },
            { paymentStatus: "failed" },
        ).session(atomSession);
        throw new ApiError(500,'Payment failed',error); // Let the global error handler handle the error
    } finally {
        atomSession.endSession(); // End the session
    }
})

export const getUserTransactions=asyncHandler(async(req,res)=>{

    const transactions=await Transaction.find({$or:[{senderId:req.user?._id},{receiverId:req.user?._id}]},{senderId:1,receiverId:1,moneySent:1,createdAt:1,paymentStatus:1}).
    populate("senderId receiverId","name -_id").sort({createdAt:-1})

    return ApiResponse.send(res,200,transactions,"transactions fetched successfully")
})