/* eslint-disable react/no-multi-comp */
import React, { useEffect } from "react"
import { render, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import { AircraftGroup } from "../classes/groups/group"
import { useAnimationSettings } from "./use-animation-settings"

describe("use-animation-settings-hook", () => {
  it("stores_settings", async () => {
    const Component = () => {
      const { state } = useAnimationSettings({ pic: "", groups: [] })

      return (
        <>
          {state.isAnimate} {state.speedSliderValue}
        </>
      )
    }

    const wrapper = render(<Component />)

    await waitFor(() => {
      expect(wrapper.queryAllByText("1").length).toBeGreaterThan(0)
    })
  })

  it("handles_animation_speed_change", async () => {
    const Component = () => {
      const { state, handlers } = useAnimationSettings({ pic: "", groups: [] })

      useEffect(() => {
        handlers.onSliderChange(5)
      }, [])

      return <>{state.speedSliderValue}</>
    }

    const wrapper = render(<Component />)

    await waitFor(() => {
      expect(wrapper.queryAllByText("5").length).toBeGreaterThan(0)
    })
  })

  it("handles_animation_start", async () => {
    const Component = () => {
      const { state, handlers } = useAnimationSettings({
        pic: "",
        groups: [new AircraftGroup()],
      })

      useEffect(() => {
        handlers.startAnimate()
      }, [])

      return (
        <div data-testid="testArea">{`${state.isAnimate} ${state.speedSliderValue}`}</div>
      )
    }

    const wrapper = render(<Component />)

    await waitFor(() => {
      expect(
        wrapper.queryByTestId("testArea")?.innerHTML.includes("true")
      ).toEqual(true)
    })
  })

  it("handles_animation_stop", async () => {
    const Component = () => {
      const { state, handlers } = useAnimationSettings({
        pic: "",
        groups: [new AircraftGroup()],
      })

      useEffect(() => {
        handlers.startAnimate()
      }, [])

      const handlePause = handlers.pauseAnimate

      return (
        <>
          <div data-testid="testArea">{`${state.isAnimate} ${state.speedSliderValue}`}</div>
          <button type="button" onClick={handlePause} id="pauseBtn" />
        </>
      )
    }

    const wrapper = render(<Component />)

    await waitFor(() => {
      expect(
        wrapper.queryByTestId("testArea")?.innerHTML.includes("true")
      ).toEqual(true)
    })

    const testbtn = await wrapper.findByRole("button")

    userEvent.click(testbtn)

    await waitFor(() => {
      expect(
        wrapper.queryByTestId("testArea")?.innerHTML.includes("true")
      ).toEqual(false)
    })
  })
})
