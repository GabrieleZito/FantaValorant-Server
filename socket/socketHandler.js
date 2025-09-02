const userSockets = new Map();

module.exports = function (io) {
    io.on("connection", (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);
        socket.on("disconnect", () => {
            console.log("🔥: " + socket.data.username + " disconnected");
        });

        socket.on("user:register", (data) => {
            const { userId, username } = data;
            userSockets.set(userId, socket.id);
            socket.data.username = username;

            socket.emit("user:registered", {
                success: true,
            });
        });
    });
};
