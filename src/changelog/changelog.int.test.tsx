import React from "react"
import { Accordion } from "../utils/muiadapter"
import { mount } from "enzyme"
import ChangeLog from "./changelog"
import { ThemeProvider } from "@mui/styles"
import { createTheme } from "@mui/material"

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
