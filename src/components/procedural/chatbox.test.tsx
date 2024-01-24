import React from "react"
import {
  RenderResult,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { vi, describe, it, expect } from "vitest"
import { AircraftGroup } from "../../classes/groups/group"
import { ChatBox, CBProps } from "./chatbox"

vi.mock("react-speech-recognition", () => ({
  useSpeechRecognition: () => ({
    transcript: "",
    finalTranscript: "",
    setTranscript: vi.fn(),
  }),
}))

const mockProcess = vi.fn()

vi.mock("./aiprocess", () => ({
  aiProcess: () => mockProcess(),
}))

const mockUtter = vi.fn()

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

  const writeMessage = async (cbox: RenderResult, msg: string) => {
    const input = cbox.getByTestId("chatInput")

    fireEvent.change(input, { target: { value: msg } })
    await waitFor(() => {
      expect((cbox.getByTestId("chatInput") as HTMLInputElement).value).toEqual(
        msg
      )
    })
  }

  function submit(wrapper: RenderResult) {
    const submitBtn = wrapper.getByTestId("submitBtn")

    userEvent.click(submitBtn)
  }

  it("handles_message", async () => {
    const cbox = render(<ChatBox {...props} />)

    expect(cbox).toBeDefined()
    writeMessage(cbox, "hello world")
    submit(cbox)

    await waitFor(() => {
      expect(
        cbox.getByTestId("chatroom").textContent?.includes("hello world")
      ).toEqual(true)
    })
  })

  it("handles_nickchange", async () => {
    const cbox = render(<ChatBox {...props} />)

    expect(cbox).toBeDefined()
    writeMessage(cbox, "/nick mycallsign")
    submit(cbox)

    await waitFor(() => {
      expect(
        cbox
          .getByTestId("chatroom")
          .textContent?.includes("changed nick to mycallsign")
      ).toEqual(true)
    })
  })

  it("handles_rundown", async () => {
    const cbox = render(<ChatBox {...props} />)

    expect(cbox).toBeDefined()
    writeMessage(cbox, "/handover")
    submit(cbox)

    await waitFor(() => {
      expect(
        cbox.getByTestId("chatroom").textContent?.includes("BMA Rundown")
      ).toEqual(true)
    })
  })

  it("handles_help", async () => {
    const cbox = render(<ChatBox {...props} />)

    expect(cbox).toBeDefined()
    writeMessage(cbox, "/help")
    submit(cbox)

    await waitFor(() => {
      expect(
        cbox.getByTestId("chatroom").textContent?.includes("HELP")
      ).toEqual(true)

      expect(
        cbox.getByTestId("chatroom").textContent?.includes("END HELP")
      ).toEqual(true)

      expect(
        cbox.getByTestId("chatroom").textContent?.includes("------------")
      ).toEqual(true)
    })
  })

  it("handles_unknown_cmd", async () => {
    const cbox = render(<ChatBox {...props} />)

    expect(cbox).toBeDefined()
    writeMessage(cbox, "/gibberish")
    submit(cbox)

    await waitFor(() => {
      expect(
        cbox.getByTestId("chatroom").textContent?.includes("Unknown command")
      ).toEqual(true)
    })
  })

  it.skip("handles_voice_message", () => {
    // chatbox.sendMessage("me", "hello world", true)
    // expect(mockProcess).toHaveBeenCalledTimes(0)
    // expect(chatbox.state.text).toEqual("")
    // expect(mockUtter).toHaveBeenCalledTimes(1)
  })

  it("handles_enter_press", async () => {
    const cbox = render(<ChatBox {...props} />)

    expect(cbox).toBeDefined()
    writeMessage(cbox, "gibberish")

    const inputArea = cbox.getByTestId("chatInput")

    fireEvent.keyDown(inputArea, { key: "Enter", code: "Enter", charCode: 13 })

    await waitFor(() => {
      expect(
        cbox.getByTestId("chatroom").textContent?.includes("gibberish")
      ).toEqual(true)
    })
  })

  it("no_op_other_keypress", async () => {
    const cbox = render(<ChatBox {...props} />)

    expect(cbox).toBeDefined()
    writeMessage(cbox, "gibberish")

    const inputArea = cbox.getByTestId("chatInput")

    fireEvent.keyDown(inputArea, { key: "a", code: "a", charCode: 65 })

    await waitFor(() => {
      expect(
        cbox.getByTestId("chatroom").textContent?.includes("gibberish")
      ).not.toEqual(true)
    })
  })
})
