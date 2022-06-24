import { MouseCoords } from "../types/commands";

export const circleDrawer = (
  { x, y }: MouseCoords,
  radius: number,
  drawer: (nextX: number, nextY: number) => void
) => {
  let step = 0.01 * Math.PI;
  const centerX = x - radius;
  const centerY = y;
  let nextX = 0;
  let nextY = 0;

  for (let a = 0; a < 2 * Math.PI; a += step) {
    nextX = centerX + radius * Math.cos(a);
    nextY = centerY + radius * Math.sin(a);

    drawer(nextX, nextY);
  }
};
