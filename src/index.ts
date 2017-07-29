import * as server from "./server";

server.createAndListen(parseInt(process.env.PORT, 10) || 9999);
