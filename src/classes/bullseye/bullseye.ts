import { PaintBrush } from "../../canvas/draw/paintbrush"
import { randomNumber } from "../../utils/math"
import { Point } from "../point"

export class Bullseye {
  private static bull: Point

  public static generate(p?: Point): void {
    const context = PaintBrush.getContext()

    if (p) {
      this.bull = p
    } else {
      const centerPointX = randomNumber(
        context.canvas.width * 0.33,
        context.canvas.width * 0.66
      )
      const centerPointY = randomNumber(
        context.canvas.height * 0.33,
        context.canvas.height * 0.66
      )

      this.bull = new Point(centerPointX, centerPointY)
      console.log(this.bull)
    } // else {
    //this.bull = new Point(0, 0)
    //}
  }

  public static get(): Point {
    if (!Bullseye.bull) Bullseye.generate()

    return Bullseye.bull
  }
}
