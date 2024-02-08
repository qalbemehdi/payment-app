import { sampleData } from "../constant.js";
import { Account } from "../models/account.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { userValidation } from "../utils/zod.validation.js";
import bcrypt from "bcrypt";

export const addSampleData = asyncHandler(async (req, res) => {
  const users = sampleData;
  const existingEmails = await User.find(
    { email: { $in: users.map((user) => user.email) } },
    { email: 1, _id: 0 }
  );

  const existingEmailValues = existingEmails.map((item) => item.email);

  const uniqueUsers = users.filter(
    (user) => !existingEmailValues?.includes(user.email)
  );

  if (uniqueUsers.length > 0) {

    //for each loop doesnot work with async code because it does not wait for the promises to resolve
    for (const user of uniqueUsers) {
      userValidation.safeParse(user);
      user.password = await bcrypt.hash(user.password, 10);
    }

   const users= await User.insertMany(uniqueUsers);

   if(users.length==0)
    throw new ApiError(500,"server problem can upload sample data")

   const usersAccount=[];
   for (const user of users) {
      usersAccount.push({userId:user._id,balance:Math.round(1+Math.random()*100000)})
   }
   const account=await Account.insertMany(usersAccount);
  
    return ApiResponse.send(
      res,
      200,
      uniqueUsers.length,
      "data added successfully"
    );
  } else
    return ApiResponse.send(res, 200, uniqueUsers.length, "no unique users");
});
