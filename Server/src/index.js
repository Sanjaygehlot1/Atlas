import dotenv from 'dotenv';
import DBConnect from './DataBase/DBConnection.js';
import { app } from './app.js';


dotenv.config(
    {
        path: './.env'
    }
);
DBConnect().then(()=>{
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1); 
})