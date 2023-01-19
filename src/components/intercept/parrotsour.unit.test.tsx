import React from "react"
import { render } from "@testing-library/react"
import { ParrotSourIntercept } from "./parrotsour"

describe("ParrotSourIntercept", () => {
  it("renders", () => {
    const wrapper = render(<ParrotSourIntercept />)

    expect(wrapper).toBeDefined()
  })
})
