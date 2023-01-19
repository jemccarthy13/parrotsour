import React from "react"
import { render, waitFor } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import { PicAnimationHandler } from "../animation/intercept"
import { SensorType } from "../classes/aircraft/datatrail/sensortype"
import { AircraftGroup } from "../classes/groups/group"
import { FORMAT } from "../classes/supportedformats"
import { BlueInThe, PictureCanvasProps } from "./canvastypes"
import PictureCanvas from "./intercept"

jest.mock("../animation/intercept")

const mockDraw = jest
  .spyOn(AircraftGroup.prototype, "draw")
  .mockImplementation(() => {
    console.log("hello")
  })
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
    resetCallback: resetFn,
    sliderSpeed: 100,
    braaFirst: true,
    showMeasurements: true,
    dataStyle: SensorType.ARROW,
    isHardMode: false,
    newPic: false,
    animate: false,
    animateCallback: jest.fn(),
    orientation: {
      height: 200,
      width: 200,
      orient: BlueInThe.EAST,
    },
    desiredNumContacts: 0,
  }

  it("full_renders_mouse_and_pic_canvas", async () => {
    const wrapper = render(<PictureCanvas {...testProps} />)

    await waitFor(() => {
      expect(wrapper).toBeDefined()
    })
  })

  it("renders_blueinthe_north", async () => {
    const wrapper = render(
      <PictureCanvas
        {...testProps}
        picType="random"
        orientation={{
          height: 200,
          width: 200,
          orient: BlueInThe.NORTH,
        }}
      />
    )

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

    act(() => {
      rerender(
        <PictureCanvas
          {...testProps}
          orientation={{ height: 100, width: 100, orient: BlueInThe.WEST }}
        />
      )
    })

    await waitFor(() => {
      expect(resetFn).toHaveBeenCalled()
    })
  })

  it("pause_animate_has_no_reset", async () => {
    const wrapper = render(
      <PictureCanvas {...testProps} resetCallback={undefined} />
    )
    const { rerender } = wrapper

    act(() => {
      rerender(
        <PictureCanvas
          {...testProps}
          resetCallback={undefined}
          orientation={{ height: 100, width: 100, orient: BlueInThe.WEST }}
        />
      )
    })

    await waitFor(() => {
      expect(resetFn).not.toHaveBeenCalled()
    })
  })

  it("no_pause_and_resume_animate_if_no_animte", async () => {
    const wrapper = render(
      <PictureCanvas {...testProps} resetCallback={undefined} animate={false} />
    )
    const { rerender } = wrapper

    act(() => {
      rerender(
        <PictureCanvas
          {...testProps}
          resetCallback={undefined}
          animate={false}
          showMeasurements={false}
        />
      )
    })

    await waitFor(() => {
      expect(resetFn).not.toHaveBeenCalled()
      expect(mockDraw).toHaveBeenCalled()
      expect(animatorAnimate).not.toHaveBeenCalled()
      expect(animatorPause).not.toHaveBeenCalled()
    })
  })

  it("pause_and_resume_animate", async () => {
    const wrapper = render(
      <PictureCanvas {...testProps} resetCallback={undefined} animate />
    )

    const { rerender } = wrapper

    act(() => {
      rerender(
        <PictureCanvas
          {...testProps}
          resetCallback={undefined}
          animate
          showMeasurements={false}
        />
      )
    })

    await waitFor(() => {
      expect(resetFn).not.toHaveBeenCalled()
      expect(mockDraw).toHaveBeenCalled()
      expect(animatorAnimate).toHaveBeenCalled()
      expect(animatorPause).toHaveBeenCalled()
    })
  })
})
