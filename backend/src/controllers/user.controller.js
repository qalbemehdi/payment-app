import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { userValidation } from "../utils/zod.validation.js";
import { generateTokens } from "../utils/tokenGenerator.js";
import { Account } from "../models/account.model.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  userValidation.parse(req.body);

  const isUserExist = await User.findOne({
    email: email,
  });
  
  if (isUserExist) throw new ApiError(410, "User already registered");

  const user = await User.create({
    name,
    email,
    password,
  });

  if (!user) throw new ApiError(500, "Server error: Unable to signup");

  await Account.create({
    userId:user._id,
   balance:Math.round(1+Math.random()*100000)}
  )
  return ApiResponse.send(
    res,
    200,
    {
      name,
      email,
    },
    "user created successfully"
  );
});

export const loginUser = asyncHandler(async(req,res)=>{
  let {email,password}=req.body;
     userValidation.parse({...req.body,name:"abc"})
const user=await User.findOne({email:email})
  
if (!user) {
  throw new ApiError(404, 'User not found with this email');
}
if (!(await user.isPasswordCorrect(password))) {
  throw new ApiError(401, 'Incorrect password');
}

  const {accessToken,refreshToken}= await generateTokens(user)

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json({
    data:{accessToken,refreshToken},
    message:"user logged in successfully"
  })
})

export const logoutUser=asyncHandler(async(req,res)=>{
   
  const user=await User.findByIdAndUpdate(req.user._id,
    {$unset:{refreshToken:1}})
    const options={
      httpOnly:true,
      secure:true
    }
  
  return res.status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json({message:"user logged out successfully"})
})

export const getUser=asyncHandler(async(req,res)=>{
      const{filter}=req.query
      if(!filter)
       return  ApiResponse.send(res,200,"not found")

  const regex = new RegExp(`^${filter}`, 'i');

  const users = await User.find({ _id:{$ne:req.user._id},name: { $regex: regex } },{name:1,email:1}).sort({"name":1})
   
    if(users.length==0)
     return  ApiResponse.send(res,200,null,"no user found")

     const t=await User.collection.getIndexes();
   
  return ApiResponse.send(res, 200, users, "Users fetched successfully");
})

export const userDetails=asyncHandler(async(req,res)=>{
  const user=await User.findById({_id:req.user?._id},{name:1,email:1})

  return ApiResponse.send(res,200,user,"user fetched successfully")
})



