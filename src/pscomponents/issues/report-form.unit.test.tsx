import React from "react"
import {
  RenderResult,
  act,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { snackActions } from "../alert/psalert"
import IssueReport from "./report-form"

jest.mock("../alert/psalert", () => ({
  snackActions: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    toast: jest.fn(),
  },
}))

beforeAll(() => {
  console.warn(
    "1/15/2023- Surpressing MUI console.error for failure to wrap transition in act."
  )
  jest.spyOn(console, "error").mockImplementation()
})

describe("IssueReport_Component", () => {
  const answer = { pic: "2 GROUPS AZIMUTH 12", groups: [] }

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

    const emailBox = wrapper.getByRole(/textbox/, { name: "Email" })

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

    const emailBox = wrapper.getByRole(/textbox/, { name: "Issue Description" })

    emailBox.focus()

    fireEvent.change(emailBox, { target: { value: "issue text here" } })

    await waitFor(() => {
      expect((emailBox as HTMLTextAreaElement).value).toEqual("issue text here")
    })
  })

  it("handles_submit", async () => {
    const wrapper = render(<IssueReport answer={answer} />)

    const snackSpy = jest
      .spyOn(snackActions, "error")
      .mockImplementation(jest.fn())

    act(() => {
      openDialog(wrapper)
    })

    await waitFor(() => {
      expect(wrapper.getByText(/Cancel/)).not.toEqual(null)
    })

    act(() => {
      userEvent.click(wrapper.getByTestId(/iss-oth-selector/))
    })

    await waitFor(() => {
      expect(
        (wrapper.getByTestId(/iss-oth-selector/) as HTMLInputElement).checked
      ).toEqual(true)
    })
    const email = wrapper.getByRole(/textbox/, { name: "Email" })

    fireEvent.change(email, { target: { value: "abc@def.com" } })

    const issTxt = wrapper.getByRole(/textbox/, { name: "Issue Description" })

    fireEvent.change(issTxt, { target: { value: "My issue description" } })

    await waitFor(() => {
      expect((issTxt as HTMLInputElement).value).toEqual("My issue description")
    })

    const submitBtn = wrapper.getByRole(/button/, { name: "Submit" })

    userEvent.click(submitBtn)

    await waitFor(() => {
      expect(snackSpy).toHaveBeenCalled()
    })
  })
})
