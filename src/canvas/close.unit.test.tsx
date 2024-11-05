import React, { act } from "react"
import { render, waitFor } from "@testing-library/react"
import { vi, describe, it, expect, beforeAll, afterEach } from "vitest"
import { CloseAnimationHandler } from "../animation/close"
import { SensorType } from "../classes/aircraft/datatrail/sensortype"
import { AircraftGroup } from "../classes/groups/group"
import { FORMAT } from "../classes/supportedformats"
import { BlueInThe, PictureCanvasProps } from "./canvastypes"
import CloseCanvas from "./close"

vi.mock("../animation/close")

const mockDraw = vi
  .spyOn(AircraftGroup.prototype, "draw")
  .mockImplementation(vi.fn())
const animatorAnimate = vi.spyOn(CloseAnimationHandler.prototype, "animate")
const animatorPause = vi.spyOn(CloseAnimationHandler.prototype, "pauseFight")

const resetFn = vi.fn()

describe("CloseCanvas", () => {
  beforeAll(() => {
    vi.spyOn(global.console, "warn").mockImplementation(vi.fn())
  })

  afterEach(() => {
    animatorAnimate.mockReset()
    animatorPause.mockReset()
    vi.resetAllMocks()
  })

  const testProps: PictureCanvasProps = {
    picType: "azimuth",
    format: FORMAT.ALSA,
    setAnswer: vi.fn(),
    resetCallback: resetFn,
    sliderSpeed: 100,
    braaFirst: true,
    showMeasurements: true,
    dataStyle: SensorType.ARROW,
    isHardMode: false,
    newPic: false,
    animate: false,
    animateCallback: vi.fn(),
    orientation: {
      height: 200,
      width: 200,
      orient: BlueInThe.EAST,
    },
    desiredNumContacts: 0,
  }

  it("full_renders_mouse_and_pic_canvas", async () => {
    const wrapper = render(<CloseCanvas {...testProps} />)

    await waitFor(() => {
      expect(wrapper).toBeDefined()
    })
  })

  it("renders_blueinthe_north", async () => {
    const wrapper = render(
      <CloseCanvas
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
    const wrapper = render(<CloseCanvas {...testProps} />)

    await waitFor(() => {
      expect(wrapper.getByTestId("mousecanvas")).toBeDefined()
    })
  })

  it("stops_animate_when_orientation_changed", async () => {
    const wrapper = render(<CloseCanvas {...testProps} />)
    const { rerender } = wrapper

    act(() => {
      rerender(
        <CloseCanvas
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
      <CloseCanvas {...testProps} resetCallback={undefined} />
    )
    const { rerender } = wrapper

    act(() => {
      rerender(
        <CloseCanvas
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
      <CloseCanvas {...testProps} resetCallback={undefined} animate={false} />
    )
    const { rerender } = wrapper

    act(() => {
      rerender(
        <CloseCanvas
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
      <CloseCanvas {...testProps} resetCallback={undefined} animate />
    )

    const { rerender } = wrapper

    act(() => {
      rerender(
        <CloseCanvas
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
