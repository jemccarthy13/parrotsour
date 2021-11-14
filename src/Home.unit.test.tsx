import React from "react"
import { mount, shallow } from "enzyme"

import Home from "./Home"
import ParrotSour from "./pscomponents/parrotsour"
import { createHashHistory } from "history"
import ParrotSourIntercept from "./pscomponents/intercept/parrotsourintercept"
import ParrotSourProcedural from "./pscomponents/procedural/parrotsourprocedural"
import ParrotSourChooser from "./pscomponents/parrotsourchooser"

describe("Home", () => {
  beforeAll(() => {
    console.warn(
      "These tests do not accurately render home.\r\n" +
        "Waiting for the Suspense to resolve is not currently implemented/supported"
    )
  })

  it("should_render_default", () => {
    console.warn("This test assumes default is intercept -- should it be?")
    const home = shallow(<Home />)
    expect(home.find(ParrotSour)).toBeDefined()
    expect(home.find(ParrotSourIntercept)).toBeDefined()
    expect(home).toMatchSnapshot()
  })

  it("should_render_with_procedural", async () => {
    const history = createHashHistory()
    history.push("/procedural.html")
    const home = mount(<Home />)
    expect(home.find(ParrotSourProcedural)).toBeDefined()
  })

  it("should_render_with_intercept", async () => {
    const history = createHashHistory()
    history.push("/intercept.html")
    const home = mount(<Home />)
    expect(home.find(ParrotSourIntercept)).toBeDefined()
  })

  it("should_render_with_chooser", async () => {
    const history = createHashHistory()
    history.push("/parrotsour.html")
    const home = mount(<Home />)
    expect(home.find(ParrotSourChooser)).toBeDefined()
  })
})
