import app from "../app.js"
import userRouter from "./user.routes.js"

 const subRoute=()=>{
    app.use('/user',userRouter)
}
export default subRoute;