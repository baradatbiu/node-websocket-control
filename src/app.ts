import Jimp from "jimp";
import { httpServer } from "./http_server/index";
import robot from "robotjs";
import { WebSocketServer } from "ws";
import "./env";

const HTTP_PORT = Number(process.env.HTTP_PORT) || 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
