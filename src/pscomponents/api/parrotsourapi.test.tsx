import React from "react"
import { render } from "@testing-library/react"
import { ParrotSourAPI } from "./parrotsourapi"

describe("psapi", () => {
  it("renders", () => {
    const apiPage = render(<ParrotSourAPI />)

    expect(apiPage.getAllByRole(/button/).length).toBeGreaterThan(0)
  })
})
