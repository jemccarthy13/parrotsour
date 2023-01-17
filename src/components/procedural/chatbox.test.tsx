import React from "react"
import { render } from "@testing-library/react"
import { AircraftGroup } from "../../classes/groups/group"
import ChatBox, { CBProps } from "./chatbox"

jest.mock("react-speech-recognition", () => ({
  useSpeechRecognition: () => ({
    transcript: "",
    finalTranscript: "",
    setTranscript: jest.fn(),
  }),
}))

const mockProcess = jest.fn()

jest.mock("./aiprocess", () => ({
  aiProcess: () => mockProcess(),
}))

const mockUtter = jest.fn()

window.SpeechSynthesisUtterance = mockUtter

describe("ChatBox", () => {
  const group: AircraftGroup = new AircraftGroup()

  group.setLabel("MYLABEL")
  const props: CBProps = {
    answer: {
      pic: "",
      groups: [group],
    },
  }

  it("chatbox", () => {
    const cbox = render(<ChatBox {...props} />)

    expect(cbox).toBeDefined()
  })

  it.skip("handles_message", () => {
    // chatbox.handleMessage("hi")
    expect(mockProcess).toHaveBeenCalledTimes(1)
  })

  it.skip("handles_nickchange", async () => {
    // await chatbox.sendChatMessage("/nick mycallsign")
    // expect(chatbox.state.sender).toEqual("mycallsign")
  })

  it.skip("handles_rundown", async () => {
    // await chatbox.sendChatMessage("/handover")
    // expect(chatbox.state.text.indexOf("BMA Rundown")).toBeGreaterThanOrEqual(0)
    // expect(chatbox.state.text.indexOf("MYLABEL")).toBeGreaterThanOrEqual(0)
  })

  it.skip("handles_regular_message", async () => {
    // await chatbox.sendChatMessage("hi")
    // expect(mockProcess).toHaveBeenCalledTimes(1)
    // expect(chatbox.state.text.indexOf("hi")).toBeGreaterThanOrEqual(0)
  })

  it.skip("handles_help", async () => {
    // await chatbox.sendChatMessage("/help")
    // expect(mockProcess).toHaveBeenCalledTimes(0)
    // expect(chatbox.state.text.indexOf("------------")).toBeGreaterThanOrEqual(0)
  })

  it.skip("handles_unknown_cmd", async () => {
    // await chatbox.sendChatMessage("/unknown")
    // expect(mockProcess).toHaveBeenCalledTimes(0)
    // expect(
    //   chatbox.state.text.indexOf("Unknown command")
    // ).toBeGreaterThanOrEqual(0)
  })

  it.skip("handles_voice_message", () => {
    // chatbox.sendMessage("me", "hello world", true)
    // expect(mockProcess).toHaveBeenCalledTimes(0)
    // expect(chatbox.state.text).toEqual("")
    // expect(mockUtter).toHaveBeenCalledTimes(1)
  })

  it.skip("handles_clearbox", () => {
    // chatbox._clearTextBox()
    // console.warn("cannot test -- need mount / ref to be !null")
  })
})
