import React from "react"
import { fireEvent, render, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { act } from "react-dom/test-utils"
import ParrotSourControls, { PSCProps } from "./controls"

const fakeProps: PSCProps = {
  handleSliderChange: jest.fn(),
  startAnimate: jest.fn(),
  pauseAnimate: jest.fn(),
  displayFirstChanged: jest.fn(),
  modifyCanvas: jest.fn(),
  handleDataStyleChange: jest.fn(),
}

describe("ParrotSourControls", () => {
  it("alerts_parent_animate_start", async () => {
    const wrapper = render(<ParrotSourControls {...fakeProps} />)

    const fightsOn = wrapper.getByRole(/button/, { name: "Fights On" })

    act(() => {
      userEvent.click(fightsOn)
    })

    await waitFor(() => {
      expect(fakeProps.startAnimate).toHaveBeenCalled()
    })
  })

  it("alerts_parent_animate_pause", async () => {
    const wrapper = render(<ParrotSourControls {...fakeProps} />)

    const pause = wrapper.getByRole(/button/, { name: "Pause" })

    act(() => {
      userEvent.click(pause)
    })

    await waitFor(() => {
      expect(fakeProps.pauseAnimate).toHaveBeenCalled()
    })
  })

  it("alerts_parent_animate_speed_change", async () => {
    const wrapper = render(<ParrotSourControls {...fakeProps} />)

    const speed = wrapper.getByRole(/slider/)

    act(() => {
      fireEvent.change(speed, { target: { value: 1 } })
    })

    await waitFor(() => {
      expect(fakeProps.handleSliderChange).toHaveBeenCalled()
    })
  })

  it("alerts_parent_datastyle_change", async () => {
    const wrapper = render(<ParrotSourControls {...fakeProps} />)

    const dataStyle = wrapper.getByRole(/checkbox/, { name: "Data Trail:" })

    act(() => {
      userEvent.click(dataStyle)
    })

    await waitFor(() => {
      expect(fakeProps.handleDataStyleChange).toHaveBeenCalled()
    })
  })

  it("alerts_parent_displayfirst_change", async () => {
    const wrapper = render(<ParrotSourControls {...fakeProps} />)

    const bullFirst = wrapper.getByRole(/checkbox/, { name: "Display First:" })

    act(() => {
      userEvent.click(bullFirst)
    })

    await waitFor(() => {
      expect(fakeProps.displayFirstChanged).toHaveBeenCalled()
    })
  })

  it("displays_help_for_disp_first_toggle", async () => {
    const wrapper = render(<ParrotSourControls {...fakeProps} />)

    const bullFirstHelp = wrapper.getByTestId(/displayFirstHelp/)

    act(() => {
      userEvent.click(bullFirstHelp)
    })

    await waitFor(() => {
      expect(wrapper.getByText(/BULL\/BRAA toggle /i)).toBeDefined()
    })
  })

  it("displays_help_for_datatrail_toggle", async () => {
    const wrapper = render(<ParrotSourControls {...fakeProps} />)

    const dataTrailHelp = wrapper.getByTestId(/dataTrailHelp/)

    act(() => {
      userEvent.click(dataTrailHelp)
    })

    await waitFor(() => {
      expect(wrapper.getByText(/from arrows to radar/i)).toBeDefined()
    })
  })

  // Issue #19
  // -- handleslidermouseup
  // -- handleorientationchange
})
