import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/tokenGenerator.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  let user = null;
  if (
    !accessToken ||
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, (err) => {
      return err ? true : false;
    })
  ) {
    
    if (refreshToken) {
      await jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        async (err, decoded) => {
          if (err)
            throw new ApiError(400, "Session expired: Please login again ");
          else {
            user = await User.findById({ _id: decoded._id }).select(
              "-password -refreshToken"
            );
            
          }
        }
      );
      if (user) {
        const result = await generateTokens(user);
        user = result.user;
      }
    } else {
      throw new ApiError(400, "session is expired");
    }
  } else {
    const { _id } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
    user = await User.findById(_id).select("-password -refreshToken");
  }

  if (!user)
    throw new ApiError(500, "something wrong happened please login again");

  req.user = user;
 
  next();
});
