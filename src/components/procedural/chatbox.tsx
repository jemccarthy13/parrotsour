import React, {
  KeyboardEvent,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react"
import { SpeechTextControls } from "../../ai/speechtext"
import { PictureAnswer } from "../../canvas/canvastypes"
import { formatAlt } from "../../canvas/draw/formatutils"
import { SensorType } from "../../classes/aircraft/datatrail/sensortype"
import { AircraftGroup } from "../../classes/groups/group"
import { getTimeStamp } from "../../utils/time"
import { aiProcess } from "./aiprocess"
import { convertToCGRS } from "./cgrshelpers"

export type CBProps = {
  answer: PictureAnswer
}

export const ChatBox = (props: CBProps) => {
  const [text, setText] = useState(
    "*** CONNECTED TO PARROTSOUR CHAT SERVER ***\r\n" +
      "*** /help to display help information\r\n" +
      "*** /handover to simulate a handover message\r\n"
  )
  const [sender, setSender] = useState("UR_CALLSIGN")

  const chatRoomRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { answer } = props

  useEffect(() => {
    const msgBox: HTMLTextAreaElement | null = chatRoomRef.current

    if (msgBox !== null) msgBox.scrollTop = msgBox.scrollHeight
  }, [chatRoomRef.current])

  const clearTextBox = (): void => {
    const current: HTMLTextAreaElement | null = inputRef.current

    if (current !== null) current.value = ""
  }

  const sendMessage = (
    sender: string,
    message: string,
    voice?: boolean
  ): void => {
    if (!voice) {
      setText(
        (prev) => prev + getTimeStamp() + " <" + sender + "> " + message + "\n"
      )
    } else {
      const msg = new SpeechSynthesisUtterance()

      msg.text = message
      if (window.speechSynthesis) window.speechSynthesis.speak(msg)
    }
  }

  const sendSystemMsg = (msg: string) => {
    setText((prev) => prev + getTimeStamp() + " *** " + msg + "\r\n")
  }

  const sendChatMessage = (msg: string) => {
    if (msg.indexOf("/") === 0) {
      if (msg.indexOf("/nick") === 0) {
        const newCs = msg.replace("/nick", "").trim()

        setSender(newCs)
        sendSystemMsg("changed nick to " + newCs)
      } else if (msg.indexOf("/handover") === 0) {
        sendSystemMsg("BMA Rundown")
        answer.groups.forEach((grp: AircraftGroup) => {
          const pos = grp.getCenterOfMass(SensorType.ARROW)

          sendSystemMsg(
            grp.getLabel() +
              " / " +
              convertToCGRS(pos.x, pos.y) +
              " / FL " +
              formatAlt(grp.getAltitude())
          )
        })
        sendSystemMsg("End rundown")
      } else if (msg.indexOf("/help") === 0) {
        sendSystemMsg(
          "*** Use /nick to set your callsign. ***\r\n" +
            "*** This chatroom simulates an airspace control room.\r\n" +
            "*** Here you can give transit instructions to assets.\n" +
            "*** Commands can be entered in plain english. \n" +
            "*** Assets will respond if they understand the tasking.\n" +
            "*** Assets will let you know if they don't understand.\n" +
            "*** Please use 'report a bug' to request command support.\n" +
            "*** Some common formats:\n" +
            "*** RPA01 proceed 89AG FL 240\n" +
            "*** RPA01 proceed dir 89AG at FL 240\n" +
            "*** RPA01 app 89AG FL 240\n" +
            "----------------------------------------\r\n"
        )
      } else {
        sendSystemMsg("*** Unknown command")
      }
    } else {
      sendMessage(sender, msg)
      aiProcess({ text: msg, voice: false }, answer, sendMessage)
    }

    clearTextBox()
  }

  const handleInputKeypress = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    const key = event.key

    if (key === "Enter") {
      event.preventDefault()
      const text = event.currentTarget.value.toString()

      sendChatMessage(text)
    }
  }

  const handleSendBtnClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    const text = event.currentTarget.value.toString()

    sendChatMessage(text)
  }

  const handleMessage = useCallback((text: string): void => {
    aiProcess({ text, voice: true }, answer, sendMessage)
  }, [])

  return (
    <div
      id="chat"
      style={{
        width: "33%",
        marginLeft: "auto",
        marginRight: "auto",
        minHeight: "100%",
      }}
    >
      <textarea
        ref={chatRoomRef}
        id="chatroom"
        style={{ width: "100%", height: "50%" }}
        readOnly
        value={text}
      />
      <div style={{ display: "inline-flex", width: "100%" }}>
        <textarea
          ref={inputRef}
          id="chatInput"
          style={{ width: "80%", height: "10%" }}
          onKeyPress={handleInputKeypress}
        />
        <button
          type="button"
          style={{ marginLeft: "5px", width: "20%" }}
          onClick={handleSendBtnClick}
        >
          Send
        </button>
      </div>
      <SpeechTextControls handler={handleMessage} />
    </div>
  )
}

export default ChatBox
