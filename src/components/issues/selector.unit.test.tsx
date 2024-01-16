import React from "react"
import { act, fireEvent, render } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { vi } from "vitest"
import IssueSelector from "./selector"

const mockChangeFn = vi.fn(() => {
  return vi.fn()
})

describe("IssueSelector_Component", () => {
  afterEach(() => {
    mockChangeFn.mockClear()
  })

  const featureSelector = /feature/i
  const picSelector = /this picture/i
  const othSelector = /Other/i

  it("renders_picprob_default_checked", () => {
    const selWrapper = render(<IssueSelector onChange={mockChangeFn} />)

    expect(
      (selWrapper.getByLabelText(picSelector) as HTMLInputElement).checked
    ).toEqual(true)
    expect(selWrapper).toMatchSnapshot()
  })

  it.skip("alerts_parent_only_when_sel_changes", async () => {
    userEvent.setup()

    const selWrapper = render(<IssueSelector onChange={mockChangeFn} />)

    act(() => {
      selWrapper.getByLabelText(othSelector).focus()
    })

    act(() => {
      userEvent.click(selWrapper.getByLabelText(othSelector))
    })

    expect(mockChangeFn).toHaveBeenCalledTimes(1)
    expect(mockChangeFn).toHaveBeenCalledWith("othprob")

    act(() => {
      fireEvent.click(selWrapper.getByLabelText(featureSelector))
    })

    expect(mockChangeFn).toHaveBeenCalledTimes(2)
    expect(mockChangeFn).toHaveBeenCalledWith("feature")
  })
})
