import React from "react"
import { render } from "@testing-library/react"
import { vi } from "vitest"
import { ParrotSourProcedural } from "./parrotsour"

vi.mock("react-speech-recognition", () => ({
  useSpeechRecognition: () => ({
    transcript: "",
    setTranscript: vi.fn(),
  }),
}))

describe("ParrotSourProcedural", () => {
  it("renders", () => {
    const wrapper = render(<ParrotSourProcedural />)

    expect(wrapper).toBeDefined()
  })
})
