import robot from "robotjs";
import Jimp from "jimp";
import { MouseCoords } from "../types/commands";

const SCREEN_SIZE = 200;

export const getBase64Screen = async ({ x, y }: MouseCoords) => {
  const coordX = x;
  const coordY = y;

  const screen = robot.screen.capture(coordX, coordY, SCREEN_SIZE, SCREEN_SIZE);

  const image = new Jimp({
    data: screen.image,
    width: screen.byteWidth / screen.bytesPerPixel,
    height: screen.height,
  });

  let red: number, green: number, blue: number;

  screen.image.forEach((byte: number, i: number) => {
    switch (i % 4) {
      case 0:
        return (blue = byte);
      case 1:
        return (green = byte);
      case 2:
        return (red = byte);
      case 3:
        image.bitmap.data[i - 3] = red;
        image.bitmap.data[i - 2] = green;
        image.bitmap.data[i - 1] = blue;
        image.bitmap.data[i] = 255;
    }
  });

  const base64 = await image.getBase64Async(Jimp.MIME_PNG);

  return base64.split(",")[1];
};
