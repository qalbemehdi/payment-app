import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema=Schema({
    name:{
        type:String,
        index:true,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true
    },
    avatar:{
        type:String
    },
    color:{
        type:String
    },
    password:{
       type:String,
       required:true
    },
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account"
    },
    refreshToken:{
        type:String
    }

},{timestamps:true})

userSchema.pre("save",async function(next){
    if(this.isModified("password"))
      this.password= await bcrypt.hash(this.password,10)

      next();
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken= function(){
  return  jwt.sign({
        _id:this._id,
        email:this.email,
        name:this.name
    },process.env.ACCESS_TOKEN_KEY,{expiresIn:process.env.ACCESS_EXPIRES})
}
userSchema.methods.generateRefreshToken= function(){
    return  jwt.sign({
          _id:this._id,
      },process.env.REFRESH_TOKEN_KEY,{expiresIn:process.env.REFRESH_EXPIRES})
  }
  
  userSchema.index({ name: 1 });
export const User=mongoose.models.User||mongoose.model("User",userSchema)