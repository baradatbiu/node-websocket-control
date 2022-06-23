import Jimp from "jimp";
import { httpServer } from "./http_server/index";
import robot from "robotjs";
import { WebSocketServer } from "ws";
import "./env";

const HTTP_PORT = Number(process.env.HTTP_PORT) || 3000;
const WS_PORT = Number(process.env.WS_PORT) || 8080;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: WS_PORT });

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const [command, value] = data.toString().split(" ");
    const numberOfPx = Number(value);
    console.log("received: %s", data);
    const { x, y } = robot.getMousePos();
    const sendDefaultResult = () => ws.send(command);

    switch (command) {
      case "mouse_up":
        robot.moveMouse(x, y - numberOfPx);
        sendDefaultResult();
        break;
      case "mouse_down":
        robot.moveMouse(x, y + numberOfPx);
        sendDefaultResult();
        break;
      case "mouse_left":
        robot.moveMouse(x - numberOfPx, y);
        sendDefaultResult();
        break;
      case "mouse_right":
        robot.moveMouse(x + numberOfPx, y);
        sendDefaultResult();
        break;
      case "mouse_position":
        ws.send(`${command} ${x},${y}`);
        break;
      default:
        break;
    }

    console.log(`${command} x:${x},y:${y}\0`);
  });

  ws.send("something");
});
