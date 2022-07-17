import "./env";
import { httpServer } from "./http_server/index";
import { wss, wssHandler } from "./ws_server/index";

const HTTP_PORT = Number(process.env.HTTP_PORT) || 3000;
const WS_PORT = Number(process.env.WS_PORT) || 8080;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

wss.on("connection", (ws) => {
  console.log(`Start websocket server on the ${WS_PORT} port!`);
  wssHandler(ws);
});

process.on("SIGINT", () => {
  wss.close();
  process.exit();
});
