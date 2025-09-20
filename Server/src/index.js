import dotenv from 'dotenv';
import DBConnect from './DataBase/DBConnection.js';
import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import { initSocketIO } from './Utils/socketIO.js';

dotenv.config(
    {
        path: './.env'
    }
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Change to your frontend port
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join_class_room", (className) => {
    socket.join(className);
    console.log(`Socket ${socket.id} joined room ${className}`);
  });

  // Example: emit lecture_update
  // io.to(className).emit("lecture_update", { message: "Timetable updated!" });
});

app.set('io',io);


DBConnect().then(()=>{
    server.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1); 
})


