import mongoose from "mongoose"

const connectDb=async()=>{
    try {
        const connInst=await mongoose.connect(process.env.MONGODB_URI)
        console.log(connInst.connection.host);

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
export default connectDb;