import { mount } from "enzyme"
import React from "react"
import ParrotSourAPI from "./parrotsourapi"

describe("psapi", () => {
  it("renders", () => {
    const apiPage = mount(<ParrotSourAPI />)
    expect(apiPage.find("#downloadBtn")).toBeDefined()
  })
})
