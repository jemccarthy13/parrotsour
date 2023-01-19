import React from "react"
import { render, waitFor } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import { AnimationHandler } from "../animation/handler"
import { SensorType } from "../classes/aircraft/datatrail/sensortype"
import { FORMAT } from "../classes/supportedformats"
import TestCanvas from "../testutils/testcanvas"
import { BlueInThe, PictureCanvasProps } from "./canvastypes"
import { PaintBrush } from "./draw/paintbrush"
import PictureCanvas from "./intercept"
import ParrotSourCanvas from "./parrotsourcanvas"

jest.mock("../animation/handler")
const animatorAnimate = jest.spyOn(AnimationHandler.prototype, "animate")
const animatorPause = jest.spyOn(AnimationHandler.prototype, "pauseFight")

const resetFn = jest.fn()

describe("ParrotSourCanvas", () => {
  beforeAll(() => {
    TestCanvas.useContext(10, 30)
  })

  beforeEach(() => {
    PaintBrush.clearCanvas()
  })
  const testProps: PictureCanvasProps = {
    format: FORMAT.ALSA,
    setAnswer: jest.fn(),
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
    animateCallback: jest.fn(),
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
      expect(animatorPause).toHaveBeenCalled()
    })
  })

  it("no_change_when_other_props_change", async () => {
    const wrapper = render(<ParrotSourCanvas {...testProps} />)

    expect(wrapper.getByTestId(/mousecanvas/i)).toBeDefined()
    expect(animatorAnimate).not.toHaveBeenCalled()
    expect(animatorPause).not.toHaveBeenCalled()
    const { rerender } = wrapper

    act(() => {
      rerender(<ParrotSourCanvas {...testProps} />)
    })

    await waitFor(() => {
      expect(animatorAnimate).not.toHaveBeenCalled()
      expect(animatorPause).not.toHaveBeenCalled()
    })
  })

  it("handles_animation_toggled_true", async () => {
    const wrapper = render(<PictureCanvas {...testProps} animate={false} />)

    expect(animatorAnimate).not.toHaveBeenCalled()
    expect(animatorPause).not.toHaveBeenCalled()

    const { rerender } = wrapper

    act(() => {
      rerender(<PictureCanvas {...testProps} animate={false} />)
    })

    act(() => {
      rerender(<PictureCanvas {...testProps} showMeasurements={false} />)
    })

    act(() => {
      rerender(<PictureCanvas {...testProps} animate />)
    })

    await waitFor(() => {
      expect(animatorAnimate).toHaveBeenCalled()
      expect(animatorPause).toHaveBeenCalled()
    })
  })

  it("no_change_when_no_previous_imagedata", () => {
    const wrapper = render(<ParrotSourCanvas {...testProps} animate={false} />)

    expect(animatorAnimate).not.toHaveBeenCalled()
    expect(animatorPause).not.toHaveBeenCalled()
    const { rerender } = wrapper

    act(() => {
      rerender(<ParrotSourCanvas {...testProps} animate />)
    })
    expect(animatorAnimate).not.toHaveBeenCalled()
    expect(animatorPause).not.toHaveBeenCalled()
  })
})
