import mongoose from "mongoose";

const DBConnect = async ()=>{
    try {
       const connected = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DATABASE_NAME}`)
       if(connected){
        console.log("DB connection successful")
       }
    } catch (error) {
        console.log(`DB connection failed:: ${error.message}`);
        process.exit(1); 
    }
}

export default DBConnect