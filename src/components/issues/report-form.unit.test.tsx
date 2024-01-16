import React from "react"
import {
  RenderResult,
  act,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
// NOTE -- replace any references to jest?
import fetchMock from "jest-fetch-mock"
import { vi, beforeAll, describe, it, expect } from "vitest"
import { snackActions } from "../alert/psalert"
import IssueReport from "./report-form"

fetchMock.enableMocks()

vi.mock("../alert/psalert", () => ({
  snackActions: {
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    toast: vi.fn(),
  },
}))

beforeAll(() => {
  console.warn(
    "1/15/2023- Surpressing MUI console.error for failure to wrap transition in act."
  )
  vi.spyOn(console, "error").mockImplementation(vi.fn())
})

describe("IssueReport_Component", () => {
  const answer = { pic: "2 GROUPS AZIMUTH 12", groups: [] }

  // const featureSelector = /feature/i
  // const picSelector = /this picture/i
  const othSelector = /Other/i
  const issDescrLabel = "Issue Description*"
  const emailLabel = "Email*"

  const openDialog = async (wrapper: RenderResult) => {
    await userEvent.click(wrapper.getByTestId(/iss-rpt-btn/i))
  }

  it("renders_correctly", () => {
    const wrapper = render(<IssueReport answer={answer} />)

    expect(wrapper).toBeDefined()
  })

  it("opens_dialog_on_button_click", async () => {
    const wrapper = render(<IssueReport answer={answer} />)

    await openDialog(wrapper)
    // open and content present
    expect("").toEqual("Fragile test... re-examine")
    expect(wrapper).toMatchSnapshot()
  })

  it("closes_dialog_on_cancel_click", async () => {
    const wrapper = render(<IssueReport answer={answer} />)

    act(() => {
      openDialog(wrapper)
    })

    await waitFor(() => {
      expect(wrapper.queryByText(/Cancel/)).not.toEqual(null)
    })

    userEvent.click(wrapper.getByText(/Cancel/))
    expect(wrapper).toMatchSnapshot()
  })

  it("closes_on_clickaway", async () => {
    const wrapper = render(
      <div id="root">
        <IssueReport answer={answer} />
      </div>
    )

    act(() => {
      openDialog(wrapper)
    })

    await waitFor(() => {
      expect(wrapper.queryByText(/Cancel/)).not.toEqual(null)
    })
    const dialogBtnRoot = wrapper.getByText(/Cancel/)

    fireEvent.keyDown(dialogBtnRoot, {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      charCode: 27,
    })

    await waitFor(() => {
      expect(wrapper.queryAllByText(/Cancel/).length).toEqual(0)
    })
  })

  it("handles_cancel", async () => {
    const wrapper = render(<IssueReport answer={answer} />)

    act(() => {
      openDialog(wrapper)
    })

    await waitFor(() => {
      expect(wrapper.getByText(/Cancel/)).not.toEqual(null)
    })

    const cancelBtn = wrapper.getByText(/Cancel/)

    act(() => {
      userEvent.click(cancelBtn)
    })

    await waitFor(() => {
      expect(wrapper.queryAllByText(/Cancel/).length).toEqual(0)
    })
  })

  it("handles_email_field_changes", async () => {
    const wrapper = render(<IssueReport answer={answer} />)

    act(() => {
      openDialog(wrapper)
    })

    await waitFor(() => {
      expect(wrapper.getByText(/Cancel/)).not.toEqual(null)
    })

    const emailBox = wrapper.getByRole("textbox", { name: emailLabel })

    emailBox.focus()

    fireEvent.change(emailBox, { target: { value: "abcdefg" } })

    await waitFor(() => {
      expect((emailBox as HTMLTextAreaElement).value).toEqual("abcdefg")
    })
  })

  it("handles_descr_field_changes", async () => {
    const wrapper = render(<IssueReport answer={answer} />)

    act(() => {
      openDialog(wrapper)
    })

    await waitFor(() => {
      expect(wrapper.getByText(/Cancel/)).not.toEqual(null)
    })

    const emailBox = wrapper.getByRole("textbox", {
      name: "Issue Description*",
    })

    emailBox.focus()

    fireEvent.change(emailBox, { target: { value: "issue text here" } })

    await waitFor(() => {
      expect((emailBox as HTMLTextAreaElement).value).toEqual("issue text here")
    })
  })

  async function fillForm(wrapper: RenderResult, email: string, text: string) {
    await waitFor(() => {
      expect(wrapper.getByText(/Cancel/)).not.toEqual(null)
    })

    act(() => {
      userEvent.click(wrapper.getByLabelText(othSelector))
    })

    await waitFor(() => {
      expect(
        (wrapper.getByLabelText(othSelector) as HTMLInputElement).checked
      ).toEqual(true)
    })

    const emailBox = wrapper.getByRole("textbox", { name: emailLabel })

    fireEvent.change(emailBox, { target: { value: email } })

    const issTxt = wrapper.getByRole("textbox", { name: issDescrLabel })

    fireEvent.change(issTxt, { target: { value: text } })

    await waitFor(() => {
      expect(
        (
          wrapper.getByRole("textbox", {
            name: issDescrLabel,
          }) as HTMLInputElement
        ).value
      ).toEqual(text)
    })
  }

  function submit(wrapper: RenderResult) {
    const submitBtn = wrapper.getByRole("button", { name: "Submit" })

    userEvent.click(submitBtn)
  }

  it("handles_submit_no_network", async () => {
    const wrapper = render(<IssueReport answer={answer} />)

    fetchMock.dontMock()
    const snackSpy = vi.spyOn(snackActions, "error").mockImplementation(vi.fn())

    act(() => {
      openDialog(wrapper)
    })

    await fillForm(wrapper, "abc@def.com", "My issue description")

    submit(wrapper)

    await waitFor(() => {
      expect(snackSpy).toHaveBeenCalled()
    })
  })

  it("handles_submit_good_fetch", async () => {
    const wrapper = render(<IssueReport answer={answer} />)

    fetchMock.enableMocks()
    fetchMock.mockOnce(JSON.stringify({ ok: true }))

    const snackSpy = vi
      .spyOn(snackActions, "success")
      .mockImplementation(vi.fn())

    act(() => {
      openDialog(wrapper)
    })

    await fillForm(wrapper, "abc@def.com", "My issue description")

    submit(wrapper)

    await waitFor(() => {
      expect(snackSpy).toHaveBeenCalled()
    })
    expect(fetchMock).toHaveBeenCalled()
  })

  it("handles_submit_failed_fetch", async () => {
    const wrapper = render(<IssueReport answer={answer} />)

    fetchMock.enableMocks()
    fetchMock.mockOnce(JSON.stringify({ ok: false }), {
      status: 500,
      statusText: undefined,
    })

    const snackSpy = vi.spyOn(snackActions, "error").mockImplementation(vi.fn())

    act(() => {
      openDialog(wrapper)
    })

    await fillForm(wrapper, "abc@def.com", "My issue description")

    submit(wrapper)

    await waitFor(() => {
      expect(snackSpy).toHaveBeenCalled()
    })
    expect(fetchMock).toHaveBeenCalled()
  })

  it("handles_submit_invalid_email", async () => {
    const wrapper = render(<IssueReport answer={answer} />)

    fetchMock.enableMocks()
    fetchMock.mockOnce(JSON.stringify({ ok: false }), {
      status: 500,
      statusText: undefined,
    })

    const snackSpy = vi.spyOn(snackActions, "error").mockImplementation(vi.fn())

    act(() => {
      openDialog(wrapper)
    })

    await fillForm(wrapper, "abc", "My issue description")

    submit(wrapper)

    await waitFor(() => {
      expect(snackSpy).toHaveBeenCalled()
    })
    expect(fetchMock).toHaveBeenCalled()
  })
})
