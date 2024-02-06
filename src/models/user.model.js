import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

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
    password:{
       type:String,
       required:true
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

export const User=mongoose.models.User||mongoose.model("User",userSchema)