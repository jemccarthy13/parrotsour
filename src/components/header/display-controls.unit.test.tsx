import React, { act } from "react"
import { render, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { vi, describe, it, expect } from "vitest"
import { BlueInThe } from "../../canvas/canvastypes"
import { SensorType } from "../../classes/aircraft/datatrail/sensortype"
import { DisplayControls, DisplayProps } from "./display-controls"

const fakeProps: DisplayProps = {
  toggles: {
    toggleDataStyle: vi.fn(),
    toggleBraaFirst: vi.fn(),
    toggleCanvasOrient: vi.fn(),
  },
  settings: {
    dataStyle: SensorType.ARROW,
    isBraaFirst: true,
    canvasConfig: {
      height: 500,
      width: 800,
      orient: BlueInThe.NORTH,
    },
  },
}

describe("ParrotSourControls", () => {
  it("alerts_parent_datastyle_change", async () => {
    const wrapper = render(<DisplayControls {...fakeProps} />)

    const dataStyle = wrapper.getByRole("checkbox", { name: "Data Trail:" })

    act(() => {
      userEvent.click(dataStyle)
    })

    await waitFor(() => {
      expect(fakeProps.toggles.toggleDataStyle).toHaveBeenCalled()
    })
  })

  it("alerts_parent_displayfirst_change", async () => {
    const wrapper = render(<DisplayControls {...fakeProps} />)

    const bullFirst = wrapper.getByRole("checkbox", { name: "Display First:" })

    act(() => {
      userEvent.click(bullFirst)
    })

    await waitFor(() => {
      expect(fakeProps.toggles.toggleBraaFirst).toHaveBeenCalled()
    })
  })

  it("displays_help_for_disp_first_toggle", async () => {
    const wrapper = render(<DisplayControls {...fakeProps} />)

    const bullFirstHelp = wrapper.getByTestId(/displayFirstHelp/)

    act(() => {
      userEvent.click(bullFirstHelp)
    })

    await waitFor(() => {
      expect(wrapper.getByText(/BULL\/BRAA toggle /i)).toBeDefined()
    })
  })

  it("displays_help_for_datatrail_toggle", async () => {
    const wrapper = render(<DisplayControls {...fakeProps} />)

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
