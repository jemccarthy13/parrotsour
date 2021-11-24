import React from "react"
import { mount, ReactWrapper } from "enzyme"
import IssueReport from "./issuereport"
import {
  Button,
  Dialog,
  DialogContent,
  TextField,
} from "../../utils/muiadapter"

// Mocked for standalone (unittest) coverage
jest.mock("./issueselector", () => {
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
  console.warn(
    "05/07/2021- Surpressing external usage of console.error\r\n" +
      "Use '(test command) --silent' to turn off all console messages."
  )
  jest.spyOn(console, "error").mockImplementation()
})

describe("IssueReport_Component", () => {
  const answer = { pic: "2 GROUPS AZIMUTH 12", groups: [] }

  const openDialog = (wrapper: ReactWrapper) => {
    if (wrapper.find(Dialog).props().open === false) {
      const btnWrapper = wrapper.find("button")
      btnWrapper.simulate("click")
    }
  }

  it("renders_correctly", () => {
    const wrapper = mount(<IssueReport answer={answer} />)
    expect(wrapper.find(Dialog).props().open).toEqual(false)
    expect(wrapper.find(DialogContent).length).toEqual(0)
  })

  it("opens_dialog_on_button_click", () => {
    const wrapper = mount(<IssueReport answer={answer} />)
    openDialog(wrapper)
    // open and content present
    expect(wrapper.find(Dialog).props().open).toEqual(true)
    expect(wrapper.find(DialogContent).length).toBeGreaterThanOrEqual(1)
    expect(wrapper).toMatchSnapshot()
  })

  it("closes_dialog_on_cancel_click", () => {
    const wrapper = mount(<IssueReport answer={answer} />)

    // open dialog programatically
    openDialog(wrapper)
    expect(wrapper.find(Dialog).props().open).toEqual(true)
    expect(wrapper.find(DialogContent).length).toBeGreaterThanOrEqual(1)

    const cancelWrap = wrapper.findWhere((wrap) => {
      return wrap.text().trim() === "Cancel" && wrap.is(Button)
    })
    expect(cancelWrap).toHaveLength(1)
    const cancel = cancelWrap.find("button")
    cancel.simulate("click")

    wrapper.update()
    expect(wrapper.find(Dialog).props().open).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it("closes_on_clickaway", async () => {
    const wrapper = mount(
      <div id="root">
        <IssueReport answer={answer} />
      </div>
    )

    wrapper.find("#showFormBtn").simulate("click")
    wrapper.update()
    const prev = wrapper.debug({ verbose: true })
    expect(prev).toBeDefined()
    const dialogBtnRoot = wrapper.find("#cancelIssueReport")
    dialogBtnRoot.at(4).simulate("keydown", {
      keyCode: 27,
      key: "Escape",
      charCode: 27,
      code: "Escape",
    })
    wrapper.update()
    expect(wrapper.debug({ verbose: true })).not.toEqual(prev)
  })

  it("handles_email_field_changes", () => {
    const wrapper = mount(<IssueReport answer={answer} />)
    openDialog(wrapper)
    const emailField = wrapper.findWhere((elem) => {
      return elem.is(TextField) && elem.prop("label") === "Email"
    })
    emailField
      .find("input")
      .at(0)
      .simulate("change", { currentTarget: { value: "abcdefg" } })
    wrapper.update()
    //expect(wrapper.debug({ verbose: true })).not.toEqual(prev)
  })

  it("handles_descr_field_changes", () => {
    const wrapper = mount(<IssueReport answer={answer} />)
    openDialog(wrapper)
    const issueField = wrapper.findWhere((elem) => {
      return elem.is(TextField) && elem.prop("label") === "Issue Description"
    })
    issueField
      .find("textarea")
      .at(0)
      .simulate("change", { currentTarget: { value: "issue text here" } })
    wrapper.update()

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
