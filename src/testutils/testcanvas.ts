import { PaintBrush } from "../canvas/draw/paintbrush"

export default class TestCanvas {
  private static canvas: HTMLCanvasElement = document.createElement("canvas")
  private static context: CanvasRenderingContext2D =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    TestCanvas.canvas.getContext("2d")!

  static useCanvas(width?: number, height?: number): void {
    this.setDimensions(width, height)
    PaintBrush.use(TestCanvas.context)
  }

  static setDimensions(width?: number, height?: number): void {
    if (width) TestCanvas.canvas.width = width
    if (height) TestCanvas.canvas.height = height
  }

  static useContext(width?: number, height?: number): CanvasRenderingContext2D {
    TestCanvas.setDimensions(width, height)
    PaintBrush.use(TestCanvas.context)
    return TestCanvas.context
  }

  static getCanvas(): HTMLCanvasElement {
    return TestCanvas.canvas
  }
}
