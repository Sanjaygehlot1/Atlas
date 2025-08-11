import dotenv from 'dotenv';
import DBConnect from './DataBase/DBConnection.js';
import app from './app.js';
import fs from 'fs';
import http from 'http';
import { initSocketIO } from './Utils/socketIO.js';

dotenv.config(
    {
        path: './.env'
    }
);

const httpServer = http.createServer(app);
const io = initSocketIO(httpServer);

app.set('io',io);


DBConnect().then(()=>{
    httpServer.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1); 
})


