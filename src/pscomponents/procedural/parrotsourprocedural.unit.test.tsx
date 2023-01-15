import React from "react"
import { render } from "@testing-library/react"
import ParrotSourProcedural from "./parrotsourprocedural"

jest.mock("react-speech-recognition", () => ({
  useSpeechRecognition: () => ({
    transcript: "",
    setTranscript: jest.fn(),
  }),
}))

describe("ParrotSourProcedural", () => {
  it("renders", () => {
    const wrapper = render(<ParrotSourProcedural />)

    expect(wrapper).toBeDefined()
  })
})
