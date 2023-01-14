import React from "react"
import { fireEvent, render, waitFor } from "@testing-library/react"
import ContactSelector from "./contactselector"

describe("Contact Selector", () => {
  it("notifies_parent_new_redair_count", async () => {
    const mockUpdateCount = jest.fn()
    const wrapper = render(<ContactSelector updateCount={mockUpdateCount} />)

    const redCount = wrapper.getByRole(/spinbutton/) as HTMLInputElement

    fireEvent.change(redCount, { target: { value: 4 } })

    await waitFor(() => {
      expect(mockUpdateCount).toHaveBeenCalledWith(4)
    })
  })

  it("notifies_parent_normalized_redair_count", async () => {
    // any red air count < 0 is normalized back to 0 (random)
    const mockUpdateCount = jest.fn()
    const wrapper = render(<ContactSelector updateCount={mockUpdateCount} />)

    const redCount = wrapper.getByRole(/spinbutton/) as HTMLInputElement

    fireEvent.change(redCount, { target: { value: -5 } })

    await waitFor(() => {
      expect(mockUpdateCount).toHaveBeenCalledWith(0)
    })
  })
})
