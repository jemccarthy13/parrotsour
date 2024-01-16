import React from "react"
import { render } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import { ParrotSourHeader } from "./header"

describe("ParrotSourHeader", () => {
  it("handles_show_quick_tips", async () => {
    const wrapper = render(
      <ParrotSourHeader answer={{ pic: "2 GROUPS AZ", groups: [] }} />
    )
    const btns = wrapper.getAllByRole("button")

    expect(btns.length).toBeGreaterThan(0)
    userEvent.click(btns[0])
  })

  it("renders_issuereport_control", () => {
    const wrapper = render(
      <ParrotSourHeader answer={{ pic: "2 GROUPS AZ", groups: [] }} />
    )
    const issReport = wrapper.getAllByTestId("iss-rpt-form")

    expect(issReport.length).toBeGreaterThan(0)
  })
})
