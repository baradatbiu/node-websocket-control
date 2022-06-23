import "./env";
import { httpServer } from "./http_server/index";
import { createWebSocketStream, WebSocketServer } from "ws";
import robot from "robotjs";
// import Jimp from "jimp";

const HTTP_PORT = Number(process.env.HTTP_PORT) || 3000;
const WS_PORT = Number(process.env.WS_PORT) || 8080;
const MOUSE_BUTTON = process.env.MOUSE_BUTTON || "left";

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: WS_PORT });

wss.on("connection", (ws) => {
  const duplex = createWebSocketStream(ws, {
    encoding: "utf8",
    decodeStrings: false,
  });

  duplex.on("data", (data: string) => {
    const [command, valueOne, valueTwo = ""] = data.toString().split(" ");
    const numberOfPx = parseInt(valueOne);

    console.log("received: %s", data);

    const { x, y } = robot.getMousePos();
    const sendDefaultResult = () => duplex.write(command);

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
        duplex.write(`${command} ${x},${y}`);
        break;
      case "draw_circle": {
        let step = 0.01 * Math.PI;
        const centerX = x - numberOfPx;
        const centerY = y;
        let nextX = 0;
        let nextY = 0;

        robot.mouseToggle("down", MOUSE_BUTTON);

        for (let a = 0; a < 2 * Math.PI; a += step) {
          nextX = centerX + numberOfPx * Math.cos(a);
          nextY = centerY + numberOfPx * Math.sin(a);

          robot.moveMouseSmooth(nextX, nextY);
        }

        robot.mouseToggle("up", MOUSE_BUTTON);

        sendDefaultResult();
        break;
      }
      case "draw_rectangle": {
        const additionalNumberOfPx = parseInt(valueTwo);

        const width = x + numberOfPx;
        const height = y + additionalNumberOfPx;

        robot.mouseToggle("down", MOUSE_BUTTON);
        robot.moveMouseSmooth(width, y);
        robot.moveMouseSmooth(width, height);
        robot.moveMouseSmooth(x, height);
        robot.moveMouseSmooth(x, y);
        robot.mouseToggle("up", MOUSE_BUTTON);

        sendDefaultResult();
        break;
      }
      case "draw_square": {
        const width = x + numberOfPx;
        const height = y + numberOfPx;

        robot.mouseToggle("down", MOUSE_BUTTON);
        robot.moveMouseSmooth(width, y);
        robot.moveMouseSmooth(width, height);
        robot.moveMouseSmooth(x, height);
        robot.moveMouseSmooth(x, y);
        robot.mouseToggle("up", MOUSE_BUTTON);

        sendDefaultResult();
        break;
      }
      default:
        break;
    }

    console.log(`${command} x:${x},y:${y}`);
  });

  duplex.write("something");
});
