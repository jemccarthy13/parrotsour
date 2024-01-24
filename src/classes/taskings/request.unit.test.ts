import { expect, it, describe } from "vitest"
import { AirspaceRequest } from "./request"

describe("AirspaceRequest", () => {
  it("intializes_has_getters", () => {
    const request = new AirspaceRequest()

    expect(request.toString()).toEqual("88AG FL 000")
  })
})
