import React from "react"
import { render } from "@testing-library/react"
import { vi, describe, it, expect } from "vitest"
import { VersionInfo } from "./versioninfo"

vi.mock("./icon/parrotsour-logo-color.svg", () => {
  return {
    ReactComponent: () => {
      return <>test_svg</>
    },
  }
})

describe("VersionInfo", () => {
  it("has_version", () => {
    const wrapper = render(<VersionInfo />)
    const vInfo = wrapper.getByTestId("version-info")

    expect(vInfo).toBeDefined()
    expect(`${vInfo.textContent}`.indexOf("Version")).not.toEqual(-1)
    expect(vInfo).toMatchSnapshot()
  })
})
