import React, { act } from "react"
import { render, waitFor } from "@testing-library/react"
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
    vi.clearAllMocks()
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
    // @ts-expect-error valid
    const wrapper = render(<ParrotSourCanvas {...testProps} />)

    expect(wrapper).toBeDefined()
  })

  it("handles_animation_toggled_false", async () => {
    // @ts-expect-error valid
    const wrapper = render(<ParrotSourCanvas {...testProps} />)

    expect(animatorAnimate).not.toHaveBeenCalled()
    expect(animatorPause).not.toHaveBeenCalled()
    const { rerender } = wrapper

    act(() => {
      // @ts-expect-error valid
      rerender(<ParrotSourCanvas {...testProps} animate={false} />)
    })

    await waitFor(() => {
      expect(animatorAnimate).not.toHaveBeenCalled()
      expect(animatorPause).toHaveBeenCalledOnce()
    })
  })

  it("no_change_when_other_props_change", async () => {
    // @ts-expect-error valid
    const wrapper = render(<ParrotSourCanvas {...testProps} />)

    expect(wrapper.getByTestId(/mousecanvas/i)).toBeDefined()
    expect(animatorAnimate).not.toHaveBeenCalled()
    expect(animatorPause).not.toHaveBeenCalledOnce()
    const { rerender } = wrapper

    act(() => {
      // @ts-expect-error valid
      rerender(<ParrotSourCanvas {...testProps} />)
    })

    await waitFor(() => {
      expect(animatorAnimate).not.toHaveBeenCalled()
      expect(animatorPause).not.toHaveBeenCalledOnce()
    })
  })

  it("handles_animation_toggled_true", async () => {
    const wrapper = render(<PictureCanvas {...testProps} animate={false} />)

    expect(animatorAnimate).not.toHaveBeenCalled()
    expect(animatorPause).not.toHaveBeenCalledOnce()

    const { rerender } = wrapper

    act(() => {
      rerender(<PictureCanvas {...testProps} animate />)
    })

    await waitFor(() => {
      expect(animatorAnimate).toHaveBeenCalled()
      expect(animatorPause).not.toHaveBeenCalled()
    })
  })

  it("no_change_when_no_previous_imagedata", () => {
    // @ts-expect-error valid
    const wrapper = render(<ParrotSourCanvas {...testProps} animate={false} />)

    expect(animatorAnimate).not.toHaveBeenCalledOnce()
    expect(animatorPause).not.toHaveBeenCalledOnce()
    const { rerender } = wrapper

    act(() => {
      // @ts-expect-error valid
      rerender(<ParrotSourCanvas {...testProps} animate />)
    })
    expect(animatorAnimate).not.toHaveBeenCalledOnce()
    expect(animatorPause).not.toHaveBeenCalledOnce()
  })
})
