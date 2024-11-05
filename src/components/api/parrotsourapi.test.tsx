import React, { act } from "react"
import { fireEvent, render, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { vi, describe, it, expect } from "vitest"
import { snackActions } from "../alert/psalert"
import { ParrotSourAPI } from "./parrotsourapi"
import * as utils from "./utils"

vi.mock("../alert/psalert", () => ({
  snackActions: {
    warning: vi.fn(),
    error: vi.fn(),
    toast: vi.fn(),
    info: vi.fn(),
  },
}))

describe("psapi", () => {
  it("handles_change_numpics", async () => {
    const apiPage = render(<ParrotSourAPI />)

    const numPics = apiPage.getByRole("spinbutton")

    fireEvent.change(numPics, { target: { value: 6 } })
    await waitFor(() => {
      expect((numPics as HTMLInputElement).value).toEqual("6")
    })
  })

  it("handles_change_include_group_info", async () => {
    const apiPage = render(<ParrotSourAPI />)

    const includeGrps = apiPage.getByRole("checkbox")

    act(() => {
      userEvent.click(includeGrps)
    })

    await waitFor(() => {
      expect((includeGrps as HTMLInputElement).checked).toEqual(false)
    })
  })

  it("handles_change_code", async () => {
    const apiPage = render(<ParrotSourAPI />)

    const codeInpt = apiPage.getByRole("textbox")

    act(() => {
      fireEvent.change(codeInpt, { target: { value: "accesscode" } })
    })

    await waitFor(() => {
      expect((codeInpt as HTMLInputElement).value).toEqual("accesscode")
    })
  })

  it("download_checks_accesscode", async () => {
    const snackSpy = vi.spyOn(snackActions, "warning")

    const apiPage = render(<ParrotSourAPI />)

    const submitBtn = apiPage.getByRole("button", { name: "Download" })

    vi.spyOn(utils, "validAccessCode").mockImplementation(() =>
      Promise.resolve(false)
    )

    act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(snackSpy).toHaveBeenCalled()
    })
  })
})
