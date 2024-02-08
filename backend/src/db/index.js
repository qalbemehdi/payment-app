import mongoose from "mongoose"
import { dbName } from "../constant.js";

const connectDb=async()=>{
    try {
        const connInst=await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`)
        console.log(connInst.connection.host);

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
export default connectDb;