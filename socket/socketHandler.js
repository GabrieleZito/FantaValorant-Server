const { getAuctionById, getAuctionItems } = require("../database/leagues");

const userSockets = new Map();
const auctions = new Map();

//TODO aggiungere controllo su socket.data, a volte è undefined, dipende da come e dove ricarichi la pagina

module.exports = function (io) {
    io.on("connection", (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);
        socket.on("disconnect", () => {
            console.log("🔥: " + socket.data.username + " disconnected");
        });

        socket.on("user:register", (data) => {
            const { userId, username, propic } = data;
            userSockets.set(userId, socket.id);
            socket.data.username = username;
            socket.data.userId = userId;
            socket.data.propic = propic;
            socket.emit("user:registered", {
                success: true,
            });
        });

        socket.on("auction:create", async (data) => {
            const { auction } = data;
            const items = await getAuctionItems(auction.id);
            const a = new Auction(auction.id, "paused", items["Auction Items"]);
            console.log("auction items: ");
            console.log(a.itemList);
            console.log("first Item:");
            console.log(a.currentItem);
            auctions.set(auction.id, a);
        });

        socket.on("auction:join", async (data) => {
            const { auctionId } = data;
            if (!auctionId || !socket.data.userId) {
                return;
            }
            let auction = auctions.get(auctionId);
            if (!auction) {
                const dbAuction = await getAuctionById(auctionId);
                auction = new Auction(dbAuction.id, dbAuction.status);
                auctions.set(dbAuction.id, auction);
            }
            socket.join(auctionId);
            auction.addUser(socket.data.userId, { username: socket.data.username, propic: socket.data.propic });
            //console.log(auction.users);
            io.to(auctionId).emit(
                "auction:users",
                Array.from(auction.users, ([key, value]) => ({
                    id: key,
                    ...value,
                }))
            );
        });

        socket.on("auction:leave", (data) => {
            //TODO aggiungere condizionme che elimina la auction se tutti escono o dopo un tot di tempo
            const auctionId = data?.auction;
            if (auctionId) {
                socket.leave(auctionId);
                const a = auctions.get(auctionId);
                a.removeUser(socket.data.userId);
                io.to(auctionId).emit(
                    "auction:users",
                    Array.from(a.users, ([key, value]) => ({
                        id: key,
                        ...value,
                    }))
                );
            }
        });

        socket.on("auction:start", () => {});

        socket.on("auction:end", (data) => {});
    });
};

class Auction {
    constructor(id, status, itemlist) {
        this.id = id;
        this.users = new Map();
        this.bids = [];
        this.duration = 60;
        this.startingBid = 0;
        this.status = status;
        this.itemList = itemlist;
        this.currentItem = this.itemList.shift();
    }

    addUser(userId, username) {
        return this.users.set(userId, username);
    }

    removeUser(userId) {
        this.users.delete(userId);
        return this.users;
    }

    start() {}
    end() {}
}
