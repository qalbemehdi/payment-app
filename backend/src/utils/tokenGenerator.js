
export const generateTokens=async (user)=>{
    const refreshToken=user.generateRefreshToken();
    const accessToken=user.generateAccessToken();
    user.refreshToken=refreshToken;
    
   await user.save({validateBeforeSave:false})
   return {refreshToken,accessToken,user}
}