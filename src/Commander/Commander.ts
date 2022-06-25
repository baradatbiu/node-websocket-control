import { MouseCoords } from "./../types/commands";
import { circleDrawer } from "./../helpers/circleDrawer";
import robot from "robotjs";
import { getBase64Screen } from "../helpers/getBase64Screen";

export class Commander {
  mouseButton = "left";

  constructor(mouseButton: string) {
    this.mouseButton = mouseButton;
  }

  get currentCoords(): MouseCoords {
    return robot.getMousePos();
  }

  async printScreen() {
    return await getBase64Screen(this.currentCoords);
  }

  moveMouseUp(numberOfPx: number) {
    const { x, y } = this.currentCoords;
    robot.moveMouse(x, y - numberOfPx);
  }

  moveMouseDown(numberOfPx: number) {
    const { x, y } = this.currentCoords;
    robot.moveMouse(x, y + numberOfPx);
  }

  moveMouseLeft(numberOfPx: number) {
    const { x, y } = this.currentCoords;
    robot.moveMouse(x - numberOfPx, y);
  }

  moveMouseRight(numberOfPx: number) {
    const { x, y } = this.currentCoords;
    robot.moveMouse(x + numberOfPx, y);
  }

  drawCircle(radius: number) {
    const drawer = (nextX: number, nextY: number) =>
      robot.moveMouseSmooth(nextX, nextY);

    robot.mouseToggle("down", this.mouseButton);
    circleDrawer(this.currentCoords, radius, drawer);
    robot.mouseToggle("up", this.mouseButton);
  }

  drawRectangle(width: number, height: number) {
    const { x, y } = this.currentCoords;
    const positionX = x + width;
    const positionY = y + height;

    robot.mouseToggle("down", this.mouseButton);
    robot.moveMouseSmooth(positionX, y);
    robot.moveMouseSmooth(positionX, positionY);
    robot.moveMouseSmooth(x, positionY);
    robot.moveMouseSmooth(x, y);
    robot.mouseToggle("up", this.mouseButton);
  }

  drawSquare(width: number) {
    const { x, y } = this.currentCoords;
    const positionX = x + width;
    const positionY = y + width;

    robot.mouseToggle("down", this.mouseButton);
    robot.moveMouseSmooth(positionX, y);
    robot.moveMouseSmooth(positionX, positionY);
    robot.moveMouseSmooth(x, positionY);
    robot.moveMouseSmooth(x, y);
    robot.mouseToggle("up", this.mouseButton);
  }

  displayCommandResult(command: string) {
    const { x, y } = this.currentCoords;
    console.log(`result: ${command} from x:${x},y:${y} - done\n`);
  }
}
