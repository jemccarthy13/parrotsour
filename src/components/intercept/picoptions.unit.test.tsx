import React, { act } from "react"
import { render, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { vi, describe, it, expect } from "vitest"
import { PicOptionsBar, POBSelProps } from "./picoptions"

const fakeProps: POBSelProps = {
  picType: "azimuth",
  handleChangePicType: vi.fn(),
  handleToggleHardMode: vi.fn(),
  isHardModeChecked: false,
  handleToggleMeasurements: vi.fn(),
  isWantMeasureChecked: false,
  handleNewPic: vi.fn(),
}

describe("PicOptionsBar", () => {
  // const wrapper = render(<PicOptionsBar {...fakeProps} />)

  it("calls_selection_change", async () => {
    const wrapper = render(<PicOptionsBar {...fakeProps} />)

    const picSelector = wrapper.getByRole("combobox")

    act(() => {
      userEvent.click(picSelector)
    })

    await waitFor(() => {
      expect(wrapper.getByRole("option", { name: "RANGE" })).toBeDefined()
    })

    act(() => {
      userEvent.click(wrapper.getByRole("option", { name: "RANGE" }))
    })

    await waitFor(() => {
      expect(fakeProps.handleChangePicType).toHaveBeenCalled()
    })
  })

  it("calls_showmeasure_change", async () => {
    const wrapper = render(<PicOptionsBar {...fakeProps} />)

    const measure = wrapper.getByRole("checkbox", {
      name: "I want to measure",
    }) as HTMLInputElement

    userEvent.click(measure)

    await waitFor(() => {
      expect(fakeProps.handleToggleMeasurements).toHaveBeenCalled()
    })
  })

  it("calls_hardmode_change", async () => {
    const wrapper = render(<PicOptionsBar {...fakeProps} />)

    const hard = wrapper.getByRole("checkbox", {
      name: "Hard Mode",
    }) as HTMLInputElement

    userEvent.click(hard)

    await waitFor(() => {
      expect(fakeProps.handleToggleHardMode).toHaveBeenCalled()
    })
  })

  it("calls_newpic_change", async () => {
    const wrapper = render(<PicOptionsBar {...fakeProps} />)

    const newPicBtn = wrapper.getByRole("button", { name: "New Pic" })

    userEvent.click(newPicBtn)

    await waitFor(() => {
      expect(fakeProps.handleNewPic).toHaveBeenCalled()
    })
  })
})
