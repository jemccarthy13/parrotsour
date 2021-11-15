import React, { useRef } from "react"
import { mount, shallow, ShallowWrapper } from "enzyme"

import ChatBox, { CBProps } from "./chatbox"
import { AircraftGroup } from "../../classes/groups/group"

jest.mock("react-speech-recognition", () => ({
  useSpeechRecognition: jest.fn(),
}))

const mockProcess = jest.fn()
jest.mock("./aiprocess", () => ({
  aiProcess: () => mockProcess(),
}))

const mockUtter = jest.fn()
window.SpeechSynthesisUtterance = mockUtter

describe("ChatBox", () => {
  let cbox: ShallowWrapper
  let chatbox: ChatBox
  const group: AircraftGroup = new AircraftGroup()
  group.setLabel("MYLABEL")
  const props: CBProps = {
    answer: {
      pic: "",
      groups: [group],
    },
  }

  beforeAll(() => {
    cbox = shallow(<ChatBox {...props} />)
    chatbox = cbox.instance() as ChatBox
  })

  beforeEach(() => {
    chatbox.setState({ text: "" })
  })

  it("chatbox", () => {
    expect(chatbox.state.sender).toEqual("UR_CALLSIGN")
  })

  it("handles_message", () => {
    chatbox.handleMessage("hi")
    expect(mockProcess).toHaveBeenCalledTimes(1)
  })

  it("handles_nickchange", async () => {
    await chatbox.sendChatMessage("/nick mycallsign")
    expect(chatbox.state.sender).toEqual("mycallsign")
  })

  it("handles_rundown", async () => {
    await chatbox.sendChatMessage("/handover")
    expect(chatbox.state.text.indexOf("BMA Rundown")).toBeGreaterThanOrEqual(0)
    expect(chatbox.state.text.indexOf("MYLABEL")).toBeGreaterThanOrEqual(0)
  })

  it("handles_regular_message", async () => {
    await chatbox.sendChatMessage("hi")
    expect(mockProcess).toHaveBeenCalledTimes(1)
    expect(chatbox.state.text.indexOf("hi")).toBeGreaterThanOrEqual(0)
  })

  it("handles_help", async () => {
    await chatbox.sendChatMessage("/help")
    expect(mockProcess).toHaveBeenCalledTimes(0)
    expect(chatbox.state.text.indexOf("------------")).toBeGreaterThanOrEqual(0)
  })

  it("handles_unknown_cmd", async () => {
    await chatbox.sendChatMessage("/unknown")
    expect(mockProcess).toHaveBeenCalledTimes(0)
    expect(
      chatbox.state.text.indexOf("Unknown command")
    ).toBeGreaterThanOrEqual(0)
  })

  it("handles_voice_message", () => {
    chatbox.sendMessage("me", "hello world", true)
    expect(mockProcess).toHaveBeenCalledTimes(0)
    expect(chatbox.state.text).toEqual("")
    expect(mockUtter).toHaveBeenCalledTimes(1)
  })

  it("handles_clearbox", () => {
    chatbox._clearTextBox()
    cbox.update()
    console.warn("cannot test -- need mount / ref to be !null")
  })
})
