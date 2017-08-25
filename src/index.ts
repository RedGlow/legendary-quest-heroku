import * as server from "./server";

server.createAndListen(parseInt(process.env.PORT || "9999", 10));
