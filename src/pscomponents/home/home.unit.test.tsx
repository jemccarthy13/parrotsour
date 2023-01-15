import React from "react"
import { render, waitFor } from "@testing-library/react"
import { createHashHistory } from "history"
import { Home } from "./home"

describe("Home", () => {
  it("should_render_default", async () => {
    const home = render(<Home />)

    await waitFor(
      () => {
        expect(home.queryByText(/Quick Tips/)).toBeDefined()
      },
      { timeout: 5000 }
    )
  }, 6000)

  it("should_render_with_procedural", async () => {
    const history = createHashHistory()

    history.push("/procedural.html")
    const home = render(<Home />)

    await waitFor(
      () => {
        expect(home.queryByText(/Quick Tips/)).toBeDefined()
      },
      { timeout: 5000 }
    )
  })

  it("should_render_with_intercept", async () => {
    const history = createHashHistory()

    history.push("/intercept.html")
    const home = render(<Home />)

    expect(home).toBeDefined()

    await waitFor(
      () => {
        expect(home.queryByText(/Quick Tips/)).toBeDefined()
      },
      { timeout: 5000 }
    )
  })

  it("should_render_with_close", async () => {
    const history = createHashHistory()

    history.push("/close.html")
    const home = render(<Home />)

    expect(home).toBeDefined()

    await waitFor(
      () => {
        expect(home.queryByText(/Quick Tips/)).toBeDefined()
      },
      { timeout: 5000 }
    )
  })

  it("should_render_with_api", async () => {
    const history = createHashHistory()

    history.push("/api.html")
    const home = render(<Home />)

    expect(home).toBeDefined()

    await waitFor(
      () => {
        expect(home.getByText(/Download/)).toBeDefined()
      },
      { timeout: 5000 }
    )
  }, 6000)

  it("should_render_with_chooser", async () => {
    const history = createHashHistory()

    history.push("/parrotsour.html")
    const home = render(<Home />)

    await waitFor(
      () => {
        expect(home.queryByText(/Intercept/)).toBeDefined()
      },
      { timeout: 5000 }
    )
  })
})
