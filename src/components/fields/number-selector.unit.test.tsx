import React from "react"
import { fireEvent, render, waitFor } from "@testing-library/react"
import { vi, describe, it, expect } from "vitest"
import { NumberSelector } from "./number-selector"

describe("Number Selector", () => {
  it("notifies_parent_new_count", async () => {
    const mockUpdateCount = vi.fn()
    const wrapper = render(
      <NumberSelector id="numContacts" updateCount={mockUpdateCount} />
    )

    const redCount = wrapper.getByRole("spinbutton") as HTMLInputElement

    fireEvent.change(redCount, { target: { value: 4 } })

    await waitFor(() => {
      expect(mockUpdateCount).toHaveBeenCalledWith(4)
    })
  })

  it("notifies_parent_normalized_count", async () => {
    // any red air count < 0 is normalized back to 0 (random)
    const mockUpdateCount = vi.fn()
    const wrapper = render(
      <NumberSelector id="numContacts" updateCount={mockUpdateCount} />
    )

    const redCount = wrapper.getByRole("spinbutton") as HTMLInputElement

    fireEvent.change(redCount, { target: { value: -5 } })

    await waitFor(() => {
      expect(mockUpdateCount).toHaveBeenCalledWith(0)
    })
  })
})
