import React from "react"
import { act, fireEvent, render, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import IssueSelector from "./selector"

const mockChangeFn = jest.fn(() => {
  return jest.fn()
})

describe("IssueSelector_Component", () => {
  afterEach(() => {
    mockChangeFn.mockClear()
  })

  it("renders_picprob_default_checked", () => {
    const selWrapper = render(<IssueSelector onChange={mockChangeFn} />)

    expect(
      (selWrapper.getByTestId(/iss-pic-selector/i) as HTMLInputElement).checked
    ).toEqual(true)
    expect(selWrapper).toMatchSnapshot()
  })

  it("alerts_parent_only_when_sel_changes", async () => {
    userEvent.setup()
    const selWrapper = render(<IssueSelector onChange={mockChangeFn} />)

    selWrapper.getByTestId(/oth-selector/i).focus()

    act(() => {
      fireEvent.click(selWrapper.getByTestId(/oth-selector/i))
    })

    await waitFor(() => {
      expect(
        (selWrapper.getByTestId(/iss-pic-selector/i) as HTMLInputElement)
          .checked
      ).toEqual(false)
    })

    expect(mockChangeFn).toHaveBeenCalledTimes(1)
    expect(mockChangeFn).toHaveBeenCalledWith("othprob")

    act(() => {
      fireEvent.click(selWrapper.getByTestId(/iss-feature-selector/i))
    })

    await waitFor(() => {
      expect(
        (selWrapper.getByTestId(/iss-oth-selector/i) as HTMLInputElement)
          .checked
      ).toEqual(false)
    })

    expect(mockChangeFn).toHaveBeenCalledTimes(2)
    expect(mockChangeFn).toHaveBeenCalledWith("feature")
  })
})
