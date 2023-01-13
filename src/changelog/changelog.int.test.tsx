import React from "react"
import { ThemeProvider } from "@mui/system"
import { mount } from "enzyme"
import { Accordion } from "../utils/muiadapter"
import { createTheme } from "../utils/muistylesadapter"
import ChangeLog from "./changelog"

/**
 * I really don't care what the changelog looks like, as long as it renders something.
 */
describe("ChangeLog", () => {
  beforeAll(() => {
    window.scrollTo = jest.fn()
  })

  it("renders_with_children", () => {
    const theme = createTheme()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <ChangeLog />
      </ThemeProvider>
    )
    expect(wrapper.find(Accordion)).toBeDefined()
  })
})
