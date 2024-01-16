import React from "react"
import { ThemeProvider } from "@mui/material"
import { render } from "@testing-library/react"
import { vi } from "vitest"
import { theme } from "../../theme"
import ChangeLog from "./changelog"

/**
 * I really don't care what the changelog looks like, as long as it renders something.
 */
describe("ChangeLog", () => {
  beforeAll(() => {
    window.scrollTo = vi.fn()
  })

  it("renders_with_children", () => {
    const wrapper = render(
      <ThemeProvider theme={theme}>
        <ChangeLog />
      </ThemeProvider>
    )

    expect(wrapper.getAllByText(/bugs/i).length).toBeGreaterThan(0)
  })
})
