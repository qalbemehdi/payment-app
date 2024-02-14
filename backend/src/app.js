import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // Allow credentials (cookies)
    methods: ['GET', 'POST', 'PATCH']
  }));
app.use(express.json({limit:"16kb"}))
app.use(cookieParser())


//routes

import router from "./routes/main.routes.js";

//main routes declaration
app.use("/api/v1",router)
export default app;