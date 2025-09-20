import { Server } from "socket.io";

const initSocketIO = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173", // Adjust this to your client's URL,
            credentials: true
        },
        transports : ['websocket', 'polling']
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