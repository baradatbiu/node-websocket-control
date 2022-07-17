import "../env";
import { createWebSocketStream, WebSocket, WebSocketServer } from "ws";
import { COMMANDS } from "../types/commands";
import { Commander } from "../Commander/Commander";

const WS_PORT = Number(process.env.WS_PORT) || 8080;
const MOUSE_BUTTON = process.env.MOUSE_BUTTON || "left";

export const wss = new WebSocketServer({ port: WS_PORT });

const commander = new Commander(MOUSE_BUTTON);

export const wssHandler = (ws: WebSocket) => {
  const duplex = createWebSocketStream(ws, {
    encoding: "utf8",
    decodeStrings: false,
  });

  duplex.on("data", async (data: string) => {
    const [command, valueOne, valueTwo = ""] = data.toString().split(" ");
    const numberOfPx = parseInt(valueOne);

    console.log("received: %s", data);

    const sendDefaultResult = () => duplex.write(`${command}\0`);

    switch (command) {
      case COMMANDS.MOUSE_UP:
        commander.moveMouseUp(numberOfPx);
        sendDefaultResult();
        break;
      case COMMANDS.MOUSE_DOWN:
        commander.moveMouseDown(numberOfPx);
        sendDefaultResult();
        break;
      case COMMANDS.MOUSE_LEFT:
        commander.moveMouseLeft(numberOfPx);
        sendDefaultResult();
        break;
      case COMMANDS.MOUSE_RIGHT:
        commander.moveMouseRight(numberOfPx);
        sendDefaultResult();
        break;
      case COMMANDS.MOUSE_POSITION:
        const { x, y } = commander.currentCoords;
        duplex.write(`${command} ${x},${y}\0`);
        break;
      case COMMANDS.DRAW_CIRCLE:
        commander.drawCircle(numberOfPx);
        sendDefaultResult();
        break;
      case COMMANDS.DRAW_RECTANGLE:
        commander.drawRectangle(numberOfPx, parseInt(valueTwo));
        sendDefaultResult();
        break;
      case COMMANDS.DRAW_SQUARE:
        commander.drawSquare(numberOfPx);
        sendDefaultResult();
        break;
      case COMMANDS.PRNT_SCRN:
        const base64String = await commander.printScreen();
        duplex.write(`${command} ${base64String}\0`);
      default:
        break;
    }

    commander.displayCommandResult(command);
  });

  duplex.on("error", () => {
    duplex.write("Some error");
  });
};
