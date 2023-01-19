import React from "react"
import { render } from "@testing-library/react"
import { ParrotSourProcedural } from "./parrotsour"

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
