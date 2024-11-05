import React from "react"
import { render, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { vi, describe, it, expect } from "vitest"
import { StandardSelector, StandardSelectorProps } from "./standardselector"

describe("StandardSelector", () => {
  const mockSelChg = vi.fn()
  const fakeProps: StandardSelectorProps = {
    onChange: mockSelChg,
  }

  it("handles_format_standard_change", async () => {
    const wrapper = render(<StandardSelector {...fakeProps} />)

    const alsaBtn = wrapper.getByRole("radio", {
      name: /ALSSA ACC/,
    }) as HTMLInputElement

    expect(alsaBtn.checked).toEqual(true)

    const ipeBtn = wrapper.getByRole("radio", {
      name: "3-3 IPE",
    }) as HTMLInputElement

    userEvent.click(ipeBtn)

    await waitFor(() => {
      expect(ipeBtn.checked).toEqual(true)
    })
  })

  it("handles_toggle_alsa_tips", async () => {
    const wrapper = render(<StandardSelector {...fakeProps} />)

    userEvent.click(wrapper.getByRole("button"))

    await waitFor(() => {
      expect(wrapper.getByText(/Download the pub/)).toBeDefined()
    })
  })
})
