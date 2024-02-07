import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { userValidation } from "../utils/zod.validation.js";

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
