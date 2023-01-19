/* istanbul ignore file */
import React, {
  KeyboardEvent,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react"
import { SpeechTextControls } from "../../ai/speechtext"
import { PictureAnswer } from "../../canvas/canvastypes"
import { getTimeStamp } from "../../utils/time"
import { aiProcess } from "../procedural/aiprocess"

type CBProps = {
  answer: PictureAnswer
}

export const CloseCommandBox = (props: CBProps) => {
  const [text, setText] = useState(
    "*** CONNECTED TO PARROTSOUR CHAT SERVER ***\r\n" +
      "*** /help to display help information\r\n"
  )

  const [sender, setSender] = useState("UR_CALLSIGN")

  const chatRoomRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const msgBox: HTMLTextAreaElement | null = chatRoomRef.current

    if (msgBox !== null) msgBox.scrollTop = msgBox.scrollHeight
  }, [chatRoomRef.current])

  const _clearTextBox = (): void => {
    const current: HTMLTextAreaElement | null = inputRef.current

    if (current) current.value = ""
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
      window.speechSynthesis.speak(msg)
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
      } else if (msg.indexOf("/help") === 0) {
        sendSystemMsg(
          "*** Use /nick to set your callsign. ***\r\n" +
            "*** This chatroom allows you to give L/R turns and\r\n" +
            "*** climb or descend commands.\n" +
            "*** Commands can be entered in 'plain' english. \n" +
            "*** Assets will respond if they understand the tasking.\n" +
            "*** Assets will let you know if they don't understand.\n" +
            "*** Please use 'report a bug' to request command support.\n" +
            "*** Some supported formats:\n" +
            "*** VR01 left 330 FL 200\n" +
            "*** VR01 right 020\n" +
            "----------------------------------------\r\n"
        )
      }
    } else {
      const { answer } = props

      sendMessage(sender, msg)
      aiProcess({ text: msg, voice: false }, answer, sendMessage)
    }

    _clearTextBox()
  }

  const handleInputKeypress = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>): void => {
      const key = event.key

      if (key === "Enter") {
        event.preventDefault()
        const text = event.currentTarget.value.toString()

        sendChatMessage(text)
      }
    },
    []
  )

  const handleSendBtnClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      const text = event.currentTarget.value.toString()

      sendChatMessage(text)
    },
    []
  )

  const handleMessage = (text: string): void => {
    const { answer } = props

    aiProcess({ text, voice: true }, answer, sendMessage)
  }

  const handler = handleMessage

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
      <SpeechTextControls handler={handler} />
    </div>
  )
}

export default CloseCommandBox
