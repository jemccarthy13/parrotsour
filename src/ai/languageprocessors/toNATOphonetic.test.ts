import { describe, it, expect } from "vitest"
import { toNATOPhonetic } from "./toNATOphonetic"

describe("toNATOPhonetic", () => {
  it("converts_str_to_NATO", () => {
    expect(toNATOPhonetic("AB")).toEqual("alpha bravo")
  })
})
