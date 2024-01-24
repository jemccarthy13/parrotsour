import React from "react"
import { render, waitFor } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import { vi, describe, it, expect, beforeAll, afterEach } from "vitest"
import { ProceduralAnimationHandler } from "../animation/procedural"
import { BlueAir } from "../classes/aircraft/blueair"
import { SensorType } from "../classes/aircraft/datatrail/sensortype"
import { AircraftGroup } from "../classes/groups/group"
import { FORMAT } from "../classes/supportedformats"
import { BlueInThe, PictureCanvasProps } from "./canvastypes"
import ProceduralCanvas from "./procedural"

vi.mock("../animation/procedural")

const animatorAnimate = vi.spyOn(
  ProceduralAnimationHandler.prototype,
  "animate"
)
const animatorPause = vi.spyOn(
  ProceduralAnimationHandler.prototype,
  "pauseFight"
)

const resetFn = vi.fn()

describe("ProceduralCanvas", () => {
  BlueAir.set(new AircraftGroup())

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

  it.only("full_renders_mouse_and_pic_canvas", async () => {
    const wrapper = render(<ProceduralCanvas {...testProps} />)

    await waitFor(() => {
      expect(wrapper).toBeDefined()
    })
  })

  it("renders_blueinthe_north", async () => {
    const wrapper = render(
      <ProceduralCanvas
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
    const wrapper = render(<ProceduralCanvas {...testProps} />)

    await waitFor(() => {
      expect(wrapper.getByTestId("mousecanvas")).toBeDefined()
    })
  })

  it("pause_animate_has_no_reset", async () => {
    const wrapper = render(
      <ProceduralCanvas {...testProps} resetCallback={undefined} />
    )
    const { rerender } = wrapper

    act(() => {
      rerender(
        <ProceduralCanvas
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
})
