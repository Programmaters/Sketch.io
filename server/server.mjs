import { Server } from "socket.io";

const io = new Server(3001);

io.on("connection", (socket) => {
    // send a message to the client
    socket.emit("onJoinLobby", "Welcome to the lobby!");

    // receive a message from the client
    socket.on("onReceiveGuess", (...args) => {
        console.log(args)
    });
});