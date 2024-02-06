import 'dotenv/config'
import connectDb from './db/index.js'
import app from './app.js';

connectDb().then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`app is running on port ${process.env.PORT||8000}`);
    })
}).catch((e)=>{
    console.log("Mongodb connection error");
})