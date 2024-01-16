import React from "react"
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { ProceduralQT } from "./procedural-tips"

/**
 * All it has to do is show up (render) with some text.
 *
 * NOTE: This shallow test was done such that a developer
 * can add or remove help text. It doesn't matter what the
 * help text says, as long as it renders.
 *
 * This test should be updated if the help becomes stateful
 * or controlled.
 */
describe("ProceduralQT_Dialog", () => {
  it("renders", () => {
    const helpDialog = render(<ProceduralQT />)

    expect(helpDialog.getByText(/procedural deconfliction/i)).toBeDefined()
  })
})
