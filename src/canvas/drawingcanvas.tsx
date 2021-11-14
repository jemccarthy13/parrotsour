import React, {
  useRef,
  useState,
  useEffect,
  ReactElement,
  TouchEvent,
} from "react"

import { DrawCanvasProps } from "./canvastypes"
import { Braaseye } from "../classes/braaseye"
import { Point } from "../classes/point"
import { PaintBrush } from "./draw/paintbrush"
import { PIXELS_TO_NM } from "../utils/psmath"
import { formatAlt } from "./draw/formatutils"
import { Aircraft } from "../classes/aircraft/aircraft"

export interface CanvasMouseEvent {
  clientX: number
  clientY: number
  getModifierState: (key: string) => boolean
}

/**
 * This Component is the root wrapper for a Canvas HTML5 element
 * @param props CanvasProps for use by the component
 */
export default function DrawingCanvas(props: DrawCanvasProps): ReactElement {
  // Refs that store References to the current DOM elements
  const canvasRef: React.RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null)

  /**
   * Every time the canvas changes, update the PaintBrush current drawing context
   * When a context is undefined in helper functions, the PaintBrush context is used.
   */
  useEffect(() => {
    PaintBrush.use(canvasRef.current?.getContext("2d"))
  }, [canvasRef])

  const mouseCanvasRef: React.RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null)
  const mouseCvCtx: React.MutableRefObject<CanvasRenderingContext2D | null> =
    useRef(null)

  // State variables are used to track mouse position
  const [mouseStart, setStart] = useState(Point.DEFAULT)
  const [mousePressed, setMousePressed] = useState(false)

  // These values are watched by useEffect to trigger a 'draw'
  const { draw, orientation, bullseye, picType, isHardMode, newPic } = props

  // useEffect is a React hook called when any of the trigger props changes
  useEffect(() => {
    // only render when we have both references available
    if (canvasRef.current !== null && mouseCanvasRef.current !== null) {
      const canvas: HTMLCanvasElement = canvasRef.current
      const mouseCanvas: HTMLCanvasElement = mouseCanvasRef.current

      const ctx = canvas.getContext("2d")
      mouseCvCtx.current = mouseCanvas.getContext("2d")
      canvas.height = orientation.height
      canvas.width = orientation.width
      canvas.style.width = orientation.width + "px"
      canvas.style.height = orientation.height + "px"

      mouseCanvas.height = orientation.height
      mouseCanvas.width = orientation.width
      mouseCanvas.style.width = orientation.width + "px"
      mouseCanvas.style.height = orientation.height + "px"

      // Trigger the parent render ('draw' from props)
      const render = async () => {
        if (draw && ctx) draw(ctx)
      }

      render()
    }
  }, [draw, orientation, picType, newPic, isHardMode])

  /**
   * Get the mouse position given the event relative to canvas
   * @param canvas the drawing canvas element
   * @param evt mouse event containing mouse {x,y} relative to canvas
   */
  const getMousePos = (
    canvas: HTMLCanvasElement | null,
    evt: CanvasMouseEvent
  ): Point => {
    const rect = canvas?.getBoundingClientRect()
    let pos = Point.DEFAULT
    if (rect) {
      pos = new Point(evt.clientX - rect.left, evt.clientY - rect.top)
    }
    return pos
  }

  /**
   * Draws bullseye and/or BRAAseye line
   * @param start start mouse position
   * @param end end mouse position
   * @param isDown true to draw BRAAseye, false to draw just bullseye hover
   */
  function drawMouse(start: Point, end: Point) {
    const prevCtx = PaintBrush.getContext()
    PaintBrush.use(mouseCvCtx.current)

    if (mousePressed && mouseCvCtx.current) {
      PaintBrush.drawLine(start.x, start.y, end.x, end.y)
    }

    const b = new Braaseye(end, start, bullseye)

    // clamp to edge of canvas and offset from cursor
    if (end.y < 20) end.y = 20
    end.x -= 50

    // determine draw locations based on BRAA/bull first setting
    const drawBEPos = {
      x: end.x,
      y: props.braaFirst ? end.y : end.y - 11,
    }
    const drawBRPos = {
      x: end.x,
      y: props.braaFirst ? end.y - 11 : end.y,
    }

    if (mouseCvCtx.current) {
      if (mousePressed) {
        b.braa.draw(drawBRPos.x, drawBRPos.y, "blue", true)
      }
      b.bull.draw(drawBEPos.x, drawBEPos.y, "black", true)
    }
    PaintBrush.use(prevCtx)
  }

  /**
   * Called when mouse is pressed. Sets starting mouse position for
   * Braaseye start point.
   * @param e CanvasMouseEvent with mouse position
   */
  const canvasMouseDown = function (e: CanvasMouseEvent) {
    setMousePressed(true)

    const mousePos = getMousePos(canvasRef.current, e)
    setStart(mousePos)
  }

  /**
   * Called when the mouse leaves the canvas.
   * Restore the imagedata (w/o line draws).
   */
  const onMouseLeave = () => {
    if (mouseCvCtx.current)
      mouseCvCtx.current.clearRect(
        0,
        0,
        mouseCvCtx.current.canvas.width,
        mouseCvCtx.current.canvas.height
      )
  }

  /**
   * When shift is down or caps lock is on, aircraft
   * inside a certain radius around the mouse cursor
   * will have their altitudes displayed inside a 'boot'
   * in the lower left hand corner.
   *
   * TODO -- Add amplifying data and 'EWI' to the boot
   *
   * @param mousePos Current mouse position in the canvas
   */
  const drawBoot = (mousePos: Point) => {
    const { answer } = props

    let alts: number[] = []
    answer.groups.forEach((grp) => {
      grp.forEach((ac) => {
        if (
          ac
            .getCenterOfMass(props.dataStyle)
            .getBR(new Point(mousePos.x + 50, mousePos.y)).range < 5
        ) {
          alts.push(ac.getAltitude())
        }
      })
    })
    alts = alts.sort().reverse()
    const ctx = mouseCvCtx.current

    if (ctx) {
      ctx.fillStyle = "white"
      const startY = 120
      const bootStartY = ctx.canvas.height - startY
      ctx.fillRect(0, bootStartY, 50, startY)
      const prevCtx = PaintBrush.getContext()
      PaintBrush.use(ctx)
      PaintBrush.drawLine(0, bootStartY, 50, bootStartY)
      PaintBrush.drawLine(50, bootStartY, 50, ctx.canvas.height)
      alts.forEach((alt, idx) => {
        PaintBrush.drawText(formatAlt(alt), 10, bootStartY + 20 + 20 * idx)
      })
      PaintBrush.use(prevCtx)
    }
  }

  //
  // Display 'baseball card' in upper left
  //
  const drawCursorInfo = (mousePos: Point) => {
    const { answer } = props
    const grps: Aircraft[] = []
    answer.groups.forEach((grp) => {
      grp.forEach((ac) => {
        if (
          ac
            .getCenterOfMass(props.dataStyle)
            .getBR(new Point(mousePos.x + 50, mousePos.y)).range < 1.5
        ) {
          grps.push(ac)
        }
      })
    })

    if (grps.length > 0) {
      if (mouseCvCtx.current) {
        const prevCtx = PaintBrush.getContext()
        PaintBrush.use(mouseCvCtx.current)
        PaintBrush.drawText("Hdg:", 20, 20)
        PaintBrush.drawText(grps[0].getHeading().toString(), 50, 20)
        PaintBrush.drawText("Alt:", 20, 40)
        PaintBrush.drawText(formatAlt(grps[0].getAltitude()), 50, 40)
        PaintBrush.use(prevCtx)
      }
    }
  }

  /**
   * Called when the mouse moves on the canvas.
   * Draws the appropriate information on the canvas.
   * @param e CanvasMouseEvent containing mouse position
   */
  const canvasMouseMove = (e: CanvasMouseEvent) => {
    const mousePos = getMousePos(canvasRef.current, e)
    if (mouseCvCtx.current && mouseCanvasRef.current) {
      mouseCvCtx.current.clearRect(
        0,
        0,
        mouseCanvasRef.current.width,
        mouseCanvasRef.current.height
      )
    }
    const isCapsLock =
      e.getModifierState("CapsLock") || e.getModifierState("Shift")

    drawMouse(mouseStart, mousePos)

    //
    // draw the range ring & "stack" boot
    //
    if (isCapsLock && mouseCvCtx.current && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      if (rect) {
        mouseCvCtx.current.strokeStyle = "green"
        mouseCvCtx.current.lineWidth = 1
        mouseCvCtx.current.beginPath()
        mouseCvCtx.current.arc(
          mousePos.x + 50,
          mousePos.y,
          5 * PIXELS_TO_NM,
          0,
          360
        )
        mouseCvCtx.current.stroke()

        drawBoot(mousePos)
      }
    } else {
      // on cur over...
      drawCursorInfo(mousePos)
    }
  }

  /**
   * Called when the mouse is released.
   * Restores previous ImageData.
   */
  const canvasMouseUp = () => {
    setMousePressed(false)
  }

  /**
   * Called when a touch event (down press) registred on canvas.
   * Converts touch event to CanvasMouseEvent for processing.
   * @param e TouchEvent containing touch location
   */
  const canvasTouchStart = (e: TouchEvent) => {
    const touch = e.changedTouches[0]
    canvasMouseDown({
      clientX: touch.clientX,
      clientY: touch.clientY,
      getModifierState: () => false,
    })
  }

  /**
   * Called when a TouchEvent (move) is registered on canvas
   * Converts TouchEvent to MouseEvent for processing
   * @param e TouchEvent containing touch location
   */
  const canvasTouchMove = (e: TouchEvent) => {
    const touch = e.changedTouches[0]
    canvasMouseMove({
      clientX: touch.clientX,
      clientY: touch.clientY,
      getModifierState: () => false,
    })
  }

  /**
   * Called when a TouchEvent (end) is registered on canvas
   * Converts TouchEvent to MouseEvent for processing
   * @param e TouchEvent containing touch location
   */
  const canvasTouchEnd = () => {
    setMousePressed(false)
  }

  const style = {
    touchAction: "none",
    backgroundColor: "white",
    width: "500px",
    height: "400px",
    border: "1px solid #000000",
  }

  const moveProps = {
    onMouseDown: canvasMouseDown,
    onMouseMove: canvasMouseMove,
    onMouseUp: canvasMouseUp,
    onTouchStart: canvasTouchStart,
    onTouchMove: canvasTouchMove,
    onTouchEnd: canvasTouchEnd,
    onMouseLeave: onMouseLeave,
  }

  return (
    <div style={{ display: "block", textAlign: "left" }}>
      <div style={{ display: "grid", position: "relative" }}>
        <canvas
          id="pscanvas"
          {...moveProps}
          style={{ ...style, gridColumn: "2", gridRow: "1", left: "0px" }}
          ref={canvasRef}
        />
        <canvas
          id="mousecanvas"
          {...moveProps}
          style={{
            ...style,
            gridColumn: "2",
            gridRow: "1",
            position: "absolute",
            left: "0px",
            backgroundColor: "transparent",
          }}
          ref={mouseCanvasRef}
        />
      </div>
    </div>
  )
}
