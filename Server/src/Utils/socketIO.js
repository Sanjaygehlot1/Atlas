import { Server } from "socket.io";

const initSocketIO = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log(`🔌 User connected: ${socket.id}`);

        // A student joins a room based on their class
        socket.on('join_class_room', (classId) => {
            socket.join(classId);
            console.log(`User ${socket.id} joined room: ${classId}`);
        });

        socket.on("disconnect", () => {
            console.log(`🔌 User disconnected: ${socket.id}`);
        });
    });

    return io;
};

export { initSocketIO }