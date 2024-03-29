import React from "react"
import { fireEvent, render } from "@testing-library/react"
import { vi, it, describe, expect } from "vitest"
import { SensorType } from "../classes/aircraft/datatrail/sensortype"
import { BlueInThe, DrawCanvasProps } from "./canvastypes"
import DrawingCanvas, { CanvasMouseEvent } from "./drawingcanvas"

/**
 * Mock draw function for a drawing canvas
 * @param context the Context to draw in
 */
const drawMock = async (): Promise<void> => {
  return new Promise(vi.fn())
}

const testProps: DrawCanvasProps = {
  draw: drawMock,
  orientation: { height: 400, width: 400, orient: BlueInThe.NORTH },
  picType: "azimith",
  braaFirst: true,
  dataStyle: SensorType.ARROW,
  newPic: false,
  animate: false,
  resetCallback: vi.fn(),
  animateCallback: vi.fn(),
  answer: { pic: "2 GRPS AZ", groups: [] },
  showMeasurements: true,
  isHardMode: false,
}

describe("drawingCanvas", () => {
  let drawingCanvas = render(<DrawingCanvas {...testProps} />)

  it("renders", () => {
    expect(drawingCanvas).toBeDefined()
  })

  it("mousemove_singular", () => {
    drawingCanvas = render(<DrawingCanvas {...testProps} />)
    expect(drawingCanvas).not.toBe(null)

    const moveEvent: CanvasMouseEvent = {
      clientX: 50,
      clientY: 50,
      // @ts-expect-error for testing
      srcEvent: { getModifierState: () => false },
    }

    const mouseCanvas = drawingCanvas.getByTestId("mousecanvas")

    fireEvent.mouseMove(mouseCanvas, moveEvent)
    expect(mouseCanvas).toMatchSnapshot()
  })

  it("mousemove_multiple", () => {
    drawingCanvas = render(<DrawingCanvas {...testProps} />)
    expect(drawingCanvas).not.toBe(null)

    const moveEvent: CanvasMouseEvent = {
      clientX: 50,
      clientY: 50,
      // @ts-expect-error for testing
      srcEvent: { getModifierState: () => false },
    }
    const moveEvent2: CanvasMouseEvent = {
      clientX: 75,
      // @ts-expect-error for testing
      srcEvent: { getModifierState: () => false },
    }

    const mouseCanvas = drawingCanvas.getByTestId("mousecanvas")

    fireEvent.mouseMove(mouseCanvas, moveEvent)
    fireEvent.mouseMove(mouseCanvas, moveEvent2)

    expect(mouseCanvas).toMatchSnapshot()
  })

  it("click_and_drag", () => {
    drawingCanvas = render(<DrawingCanvas {...testProps} />)
    expect(drawingCanvas).not.toBe(null)

    const moveEvent: CanvasMouseEvent = {
      clientX: 50,
      clientY: 50,
      // @ts-expect-error for testing
      srcEvent: { getModifierState: () => false },
    }
    const moveEvent2: CanvasMouseEvent = {
      clientX: 75,
      clientY: 50,
      // @ts-expect-error for testing
      srcEvent: { getModifierState: () => false },
    }

    const mouseCanvas = drawingCanvas.getByTestId("mousecanvas")

    fireEvent.mouseMove(mouseCanvas, moveEvent)
    fireEvent.mouseDown(mouseCanvas, moveEvent)
    fireEvent.mouseMove(mouseCanvas, moveEvent2)
    fireEvent.mouseUp(mouseCanvas, moveEvent2)

    expect(mouseCanvas).toMatchSnapshot()
  })
})
