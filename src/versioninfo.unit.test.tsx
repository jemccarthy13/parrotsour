import React from "react"
import { render } from "@testing-library/react"
import { VersionInfo } from "./versioninfo"

describe("VersionInfo", () => {
  it("has_version", () => {
    const wrapper = render(<VersionInfo />)
    const vInfo = wrapper.getByTestId("version-info")

    expect(vInfo).toBeDefined()
    expect(`${vInfo.textContent}`.indexOf("Version")).not.toEqual(-1)
    expect(vInfo).toMatchSnapshot()
  })
})
