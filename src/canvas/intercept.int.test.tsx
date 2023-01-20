import React from "react"
import { render, waitFor } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import { PicAnimationHandler } from "../animation/intercept"
import { SensorType } from "../classes/aircraft/datatrail/sensortype"
// import { AircraftGroup } from "../classes/groups/group"
import { FORMAT } from "../classes/supportedformats"
import { BlueInThe, PictureCanvasProps } from "./canvastypes"
import PictureCanvas from "./intercept"

jest.mock("../animation/intercept")

// const mockDraw = jest
//   .spyOn(AircraftGroup.prototype, "draw")
//   .mockImplementation(() => {
//     console.log("hello")
//   })
const animatorAnimate = jest.spyOn(PicAnimationHandler.prototype, "animate")
const animatorPause = jest.spyOn(PicAnimationHandler.prototype, "pauseFight")

const resetFn = jest.fn()

describe("PictureCanvas", () => {
  beforeAll(() => {
    jest.spyOn(global.console, "warn").mockImplementation()
  })

  afterEach(() => {
    animatorAnimate.mockReset()
    animatorPause.mockReset()
  })

  const testProps: PictureCanvasProps = {
    picType: "azimuth",
    format: FORMAT.ALSA,
    setAnswer: jest.fn(),
    displaySettings: {
      dataStyle: SensorType.ARROW,
      isBraaFirst: true,
      canvasConfig: {
        height: 200,
        width: 200,
        orient: BlueInThe.EAST,
      },
    },
    animationHandlers: {
      pauseAnimate: jest.fn(),
      startAnimate: jest.fn(),
      onSliderChange: jest.fn(),
    },
    animationSettings: {
      speedSliderValue: 100,
      isAnimate: false,
    },
    showMeasurements: true,
    isHardMode: false,
    newPic: false,
    desiredNumContacts: 0,
  }

  it("full_renders_mouse_and_pic_canvas", async () => {
    const wrapper = render(<PictureCanvas {...testProps} />)

    await waitFor(() => {
      expect(wrapper).toBeDefined()
    })
  })

  it("renders_blueinthe_north", async () => {
    const updatedProps = { ...testProps }

    updatedProps.displaySettings.canvasConfig = {
      height: 200,
      width: 200,
      orient: BlueInThe.NORTH,
    }

    const wrapper = render(<PictureCanvas {...updatedProps} picType="random" />)

    await waitFor(() => {
      expect(wrapper.getByTestId(/mousecanvas/)).toBeDefined()
    })
  })

  it("renders_leadedge_forced", async () => {
    const wrapper = render(<PictureCanvas {...testProps} />)

    await waitFor(() => {
      expect(wrapper.getByTestId("mousecanvas")).toBeDefined()
    })
  })

  it("stops_animate_when_hardmode_changed", async () => {
    const wrapper = render(<PictureCanvas {...testProps} />)

    const { rerender } = wrapper

    act(() => {
      rerender(<PictureCanvas {...testProps} isHardMode />)
    })

    await waitFor(() => {
      expect(resetFn).toHaveBeenCalled()
    })
  })

  it("stops_animate_when_picType_changed", async () => {
    const wrapper = render(<PictureCanvas {...testProps} />)
    const { rerender } = wrapper

    act(() => {
      rerender(<PictureCanvas {...testProps} picType="range" />)
    })

    await waitFor(() => {
      expect(resetFn).toHaveBeenCalled()
    })
  })

  it("stops_animate_when_orientation_changed", async () => {
    const wrapper = render(<PictureCanvas {...testProps} />)
    const { rerender } = wrapper

    const updatedProps = { ...testProps }

    updatedProps.displaySettings.canvasConfig = {
      height: 100,
      width: 100,
      orient: BlueInThe.WEST,
    }

    act(() => {
      rerender(<PictureCanvas {...updatedProps} />)
    })

    await waitFor(() => {
      expect(resetFn).toHaveBeenCalled()
    })
  })
})
