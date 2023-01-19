import React from "react"
import { render } from "@testing-library/react"
import { ParrotSourIntercept } from "./parrotsour"

jest.mock("react-speech-recognition", () => ({
  useSpeechRecognition: () => ({
    transcript: "",
    finalTranscript: "",
    setTranscript: jest.fn(),
  }),
}))

describe("ParrotSourIntercept", () => {
  it("renders", () => {
    const wrapper = render(<ParrotSourIntercept />)

    expect(wrapper).toBeDefined()
  })
})
