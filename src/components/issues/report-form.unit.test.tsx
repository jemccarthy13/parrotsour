import React from "react"
import {
  RenderResult,
  act,
  createEvent,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { vi, beforeAll, describe, it, expect } from "vitest"
import createFetchMock from "vitest-fetch-mock"
import { snackActions } from "../alert/psalert"
import IssueReport from "./report-form"

const fetchMock = createFetchMock(vi)

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
  vi.resetAllMocks()
})

const answer = { pic: "2 GROUPS AZIMUTH 12", groups: [] }

const othSelector = /Other/i
const issDescrLabel = "Issue Description*"
const emailLabel = "Email*"

const openDialog = async (wrapper: RenderResult) => {
  await userEvent.click(wrapper.getByTestId(/iss-rpt-btn/i))
}

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

describe("IssueReport_Component", () => {
  it("renders_correctly_no_answer", () => {
    const wrapper = render(<IssueReport />)

    expect(wrapper).toBeDefined()
  })

  it("opens_dialog_on_button_click", async () => {
    const wrapper = render(<IssueReport answer={answer} />)

    await openDialog(wrapper)
    // open and content present
    const dialog = wrapper.getByRole("dialog")

    expect(dialog).not.toBe(undefined)
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

    await waitFor(() => {
      expect(wrapper.queryByText(/Cancel/)).toEqual(null)
    })
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
    fetchMock.resetMocks()
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
    fetchMock.resetMocks()
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
    fetchMock.resetMocks()
  })

  it("handles_empty_str_email_desc", async () => {
    const wrapper = render(<IssueReport answer={answer} />)

    fetchMock.enableMocks()
    fetchMock.mockOnce(JSON.stringify({ ok: false }), {
      status: 500,
      statusText: undefined,
    })

    act(() => {
      openDialog(wrapper)
    })

    await fillForm(wrapper, "", "")

    submit(wrapper)

    expect(fetchMock).not.toHaveBeenCalled()
    fetchMock.resetMocks()
  })

  it("handles_default_desc_string_when_email_provided", async () => {
    const wrapper = render(<IssueReport answer={answer} />)

    fetchMock.enableMocks()
    fetchMock.mockOnce(JSON.stringify({ ok: false }), {
      status: 500,
      statusText: undefined,
    })

    act(() => {
      openDialog(wrapper)
    })

    await fillForm(wrapper, "abc", "")

    submit(wrapper)

    expect(fetchMock).not.toHaveBeenCalled()
    fetchMock.resetMocks()
  })

  it("skips_issue_submit_when_form_invalid", async () => {
    const validitySpy = vi.fn().mockImplementation(() => false)

    const wrapper = render(<IssueReport answer={answer} />)

    act(() => {
      openDialog(wrapper)
    })

    await fillForm(wrapper, "", "")

    const submit = document.getElementById("submitIssueReport") ?? document

    const myEvent = createEvent.click(submit, {
      currentTarget: {
        form: { reportValidity: vi.fn().mockImplementation(() => false) },
      },
    })

    fireEvent(submit, myEvent)

    const rptForm = document.getElementById("iss-rpt-form") as HTMLFormElement

    rptForm.reportValidity = validitySpy

    fetchMock.enableMocks()
    fetchMock.mockOnce(JSON.stringify({ ok: false }), {
      status: 500,
      statusText: undefined,
    })

    expect(fetchMock).not.toHaveBeenCalled()
    fetchMock.resetMocks()
  })
})
