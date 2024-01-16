import React from "react"
import { fireEvent, render, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { act } from "react-dom/test-utils"
import { vi, describe, it, expect } from "vitest"
import { AnimationControls, AnimationControlsProps } from "./animation-controls"

const fakeProps: AnimationControlsProps = {
  settings: { speedSliderValue: 50, isAnimate: false },
  handlers: {
    onSliderChange: vi.fn(),
    startAnimate: vi.fn(),
    pauseAnimate: vi.fn(),
  },
}

describe("Animation Controls", () => {
  it("alerts_parent_animate_start", async () => {
    const wrapper = render(<AnimationControls {...fakeProps} />)

    const fightsOn = wrapper.getByRole("button", { name: "Fights On" })

    act(() => {
      userEvent.click(fightsOn)
    })

    await waitFor(() => {
      expect(fakeProps.handlers.startAnimate).toHaveBeenCalled()
    })
  })

  it("alerts_parent_animate_pause", async () => {
    const wrapper = render(<AnimationControls {...fakeProps} />)

    const pause = wrapper.getByRole("button", { name: "Pause" })

    act(() => {
      userEvent.click(pause)
    })

    await waitFor(() => {
      expect(fakeProps.handlers.pauseAnimate).toHaveBeenCalled()
    })
  })

  it("alerts_parent_animate_speed_change", async () => {
    const wrapper = render(<AnimationControls {...fakeProps} />)

    const speed = wrapper.getByRole("slider")

    act(() => {
      fireEvent.change(speed, { target: { value: 1 } })
    })

    await waitFor(() => {
      expect(fakeProps.handlers.onSliderChange).toHaveBeenCalled()
    })
  })
})
