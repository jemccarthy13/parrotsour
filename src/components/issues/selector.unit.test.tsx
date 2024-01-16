import React from "react"
import { act, render, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { vi, describe, expect, it, afterEach } from "vitest"
import { IssueType } from "./formutils"
import IssueSelector from "./selector"

const mockChangeFn = vi.fn(() => {
  return vi.fn()
})

describe("IssueSelector_Component", () => {
  afterEach(() => {
    mockChangeFn.mockClear()
  })

  const picSelector = /this picture/i
  const othSelector = /Other/i

  it("renders_picprob_default_checked", () => {
    const selWrapper = render(
      <IssueSelector onChange={mockChangeFn} value={IssueType.PICTURE} />
    )

    expect(
      (selWrapper.getByLabelText(picSelector) as HTMLInputElement).checked
    ).toEqual(true)
    expect(selWrapper).toMatchSnapshot()
  })

  it("alerts_parent_only_when_sel_changes", async () => {
    userEvent.setup()

    const selWrapper = render(
      <IssueSelector onChange={mockChangeFn} value={IssueType.FEATURE} />
    )

    act(() => {
      selWrapper.getByText(othSelector).focus()
    })

    act(() => {
      userEvent.click(selWrapper.getByText(othSelector))
    })

    await waitFor(() => {
      expect(mockChangeFn).toHaveBeenCalledTimes(1)
    })
  })
})
