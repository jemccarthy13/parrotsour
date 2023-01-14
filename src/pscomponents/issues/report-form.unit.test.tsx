import React from "react"
import IssueReport from "./report-form"
import {
  RenderResult,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"

// Mocked for standalone (unittest) coverage
jest.mock("./selector", () => {
  return "div"
})

jest.mock("../alert/psalert", () => {
  return {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    toast: jest.fn(),
  }
})

beforeAll(() => {
  // console.warn(
  //   "05/07/2021- Surpressing external usage of console.error\r\n" +
  //     "Use '(test command) --silent' to turn off all console messages."
  // )
  // jest.spyOn(console, "error").mockImplementation()
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

    // open dialog programatically
    openDialog(wrapper)

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

    openDialog(wrapper)

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
    openDialog(wrapper)

    await waitFor(() => {
      expect(wrapper.getByText(/Cancel/)).not.toEqual(null)
    })

    const emailBox = wrapper.getByRole(/textbox/, { name: "Email" })
    emailBox.focus()

    fireEvent.change(emailBox, { target: { value: "abcdefg" } })

    await waitFor(() => {
      expect((emailBox as HTMLTextAreaElement).value).toEqual("abcdefg")
    })
    // const emailField = wrapper.findWhere((elem) => {
    //   return elem.is(TextField) && elem.prop("label") === "Email"
    // })
    // emailField
    //   .find("input")
    //   .at(0)
    //   .simulate("change", { currentTarget: { value: "abcdefg" } })
    // wrapper.update()
    //expect(wrapper.debug({ verbose: true })).not.toEqual(prev)
  })

  it.skip("handles_descr_field_changes", () => {
    const wrapper = render(<IssueReport answer={answer} />)
    openDialog(wrapper)
    // const issueField = wrapper.findWhere((elem) => {
    //   return elem.is(TextField) && elem.prop("label") === "Issue Description"
    // })
    // issueField
    //   .find("textarea")
    //   .at(0)
    //   .simulate("change", { currentTarget: { value: "issue text here" } })
    // wrapper.update()

    console.warn(
      "Issue #20 -- figure out a way to test " +
        "that the input value changes" +
        " as expected"
    )
    // expect(true).toEqual(false)
    // Issue #20 - figure out a way to test the input value changes?
    //expect(wrapper.debug({ verbose: true })).not.toEqual(prev)
  })
})
