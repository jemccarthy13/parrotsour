import React from "react"
import { render, waitFor } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import { vi, it, describe, expect, beforeEach, beforeAll } from "vitest"
import { AnimationHandler } from "../animation/handler"
import { SensorType } from "../classes/aircraft/datatrail/sensortype"
import { FORMAT } from "../classes/supportedformats"
import TestCanvas from "../testutils/testcanvas"
import { BlueInThe, PictureCanvasProps } from "./canvastypes"
import { PaintBrush } from "./draw/paintbrush"
import PictureCanvas from "./intercept"
import ParrotSourCanvas from "./parrotsourcanvas"

vi.mock("../animation/handler")
const animatorAnimate = vi.spyOn(AnimationHandler.prototype, "animate")
const animatorPause = vi.spyOn(AnimationHandler.prototype, "pauseFight")

const resetFn = vi.fn()

describe("ParrotSourCanvas", () => {
  beforeAll(() => {
    TestCanvas.useContext(10, 30)
  })

  beforeEach(() => {
    PaintBrush.clearCanvas()
    vi.clearAllMocks
  })

  const testProps: PictureCanvasProps = {
    format: FORMAT.ALSA,
    setAnswer: vi.fn(),
    sliderSpeed: 100,
    orientation: {
      height: 200,
      width: 200,
      orient: BlueInThe.SOUTH,
    },
    picType: "azimuth",
    braaFirst: true,
    dataStyle: SensorType.ARROW,
    showMeasurements: true,
    isHardMode: false,
    newPic: false,
    animate: true,
    animateCallback: vi.fn(),
    resetCallback: resetFn,
    desiredNumContacts: 4,
  }

  it("renders", () => {
    const wrapper = render(<ParrotSourCanvas {...testProps} />)

    expect(wrapper).toBeDefined()
  })

  it("handles_animation_toggled_false", async () => {
    const wrapper = render(<ParrotSourCanvas {...testProps} />)

    expect(animatorAnimate).not.toHaveBeenCalled()
    expect(animatorPause).not.toHaveBeenCalled()
    const { rerender } = wrapper

    act(() => {
      rerender(<ParrotSourCanvas {...testProps} animate={false} />)
    })

    await waitFor(() => {
      expect(animatorAnimate).not.toHaveBeenCalled()
      expect(animatorPause).toHaveBeenCalledOnce()
    })
  })

  it("no_change_when_other_props_change", async () => {
    const wrapper = render(<ParrotSourCanvas {...testProps} />)

    expect(wrapper.getByTestId(/mousecanvas/i)).toBeDefined()
    expect(animatorAnimate).not.toHaveBeenCalled()
    expect(animatorPause).toHaveBeenCalledOnce()
    const { rerender } = wrapper

    act(() => {
      rerender(<ParrotSourCanvas {...testProps} />)
    })

    await waitFor(() => {
      expect(animatorAnimate).not.toHaveBeenCalled()
      expect(animatorPause).toHaveBeenCalledOnce()
    })
  })

  it("handles_animation_toggled_true", async () => {
    const wrapper = render(<PictureCanvas {...testProps} animate={false} />)

    expect(animatorAnimate).not.toHaveBeenCalled()
    expect(animatorPause).toHaveBeenCalledOnce()

    const { rerender } = wrapper

    act(() => {
      rerender(<PictureCanvas {...testProps} animate />)
    })

    await waitFor(() => {
      expect(animatorAnimate).toHaveBeenCalled()
    })
  })

  it("no_change_when_no_previous_imagedata", () => {
    const wrapper = render(<ParrotSourCanvas {...testProps} animate={false} />)

    expect(animatorAnimate).toHaveBeenCalledOnce()
    expect(animatorPause).toHaveBeenCalledOnce()
    const { rerender } = wrapper

    act(() => {
      rerender(<ParrotSourCanvas {...testProps} animate />)
    })
    expect(animatorAnimate).toHaveBeenCalledOnce()
    expect(animatorPause).toHaveBeenCalledOnce()
  })
})
