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

describe.skip("ParrotSourCanvas", () => {
  beforeAll(() => {
    TestCanvas.useContext(10, 30)
  })

  beforeEach(() => {
    PaintBrush.clearCanvas()
  })
  const testProps: PictureCanvasProps = {
    format: FORMAT.ALSA,
    setAnswer: jest.fn(),
    displaySettings: {
      dataStyle: SensorType.ARROW,
      isBraaFirst: true,
      canvasConfig: {
        height: 200,
        width: 200,
        orient: BlueInThe.SOUTH,
      },
    },
    animationSettings: {
      speedSliderValue: 100,
      isAnimate: true,
    },
    animationHandlers: {
      startAnimate: jest.fn(),
      pauseAnimate: jest.fn(),
      onSliderChange: jest.fn(),
    },
    picType: "azimuth",
    showMeasurements: true,
    isHardMode: false,
    newPic: false,
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

    const updatedProps = { ...testProps }

    updatedProps.animationSettings.isAnimate = false
    act(() => {
      rerender(<ParrotSourCanvas {...updatedProps} />)
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
    const updatedProps = { ...testProps }

    updatedProps.animationSettings.isAnimate = false
    const wrapper = render(<PictureCanvas {...updatedProps} />)

    expect(animatorAnimate).not.toHaveBeenCalled()
    expect(animatorPause).not.toHaveBeenCalled()

    const { rerender } = wrapper

    act(() => {
      rerender(<PictureCanvas {...updatedProps} />)
    })

    const updProps2 = { ...updatedProps }

    updProps2.showMeasurements = false

    act(() => {
      rerender(<PictureCanvas {...updProps2} />)
    })

    const updProps3 = { ...updProps2 }

    updProps3.animationSettings.isAnimate = true

    act(() => {
      rerender(<PictureCanvas {...updProps3} />)
    })

    await waitFor(() => {
      expect(animatorAnimate).toHaveBeenCalled()
      expect(animatorPause).toHaveBeenCalled()
    })
  })

  it("no_change_when_no_previous_imagedata", () => {
    const updProps = { ...testProps }

    updProps.animationSettings.isAnimate = false
    const wrapper = render(<ParrotSourCanvas {...updProps} />)

    expect(animatorAnimate).not.toHaveBeenCalled()
    expect(animatorPause).not.toHaveBeenCalled()
    const { rerender } = wrapper

    updProps.animationSettings.isAnimate = true
    act(() => {
      rerender(<ParrotSourCanvas {...updProps} />)
    })
    expect(animatorAnimate).not.toHaveBeenCalled()
    expect(animatorPause).not.toHaveBeenCalled()
  })
})
