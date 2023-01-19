import React, { ReactElement, useCallback, useEffect, useState } from "react"
import { SxProps, Theme } from "@mui/material"
import { MUIStyledCommonProps } from "@mui/system"
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"
import { sleep } from "../utils/time"
import { normalizeSpeech } from "./process-speech"
import { MicrophoneContainer, MicrophoneIcon, MicrophoneStatus } from "./styles"

type SpeechTextProps = MUIStyledCommonProps<Theme> & {
  handler: (msgText: string) => void
  sx?: SxProps<Theme>
}

// eslint-disable-next-line react/require-default-props
export function SpeechTextControls(props: SpeechTextProps): ReactElement {
  const { finalTranscript: transcript, resetTranscript } =
    useSpeechRecognition()
  const [isListening, setIsListening] = useState(false)

  const dialTone = new Audio("/dial-phone-tone.wav")
  const beepTone = new Audio("/censorship-beep.wav")

  const handleListening = useCallback(() => {
    resetTranscript()

    SpeechRecognition.startListening({
      continuous: true,
    })
    setIsListening(true)

    dialTone.play()
    sleep(400, () => {
      dialTone.pause()
      beepTone.play()
      sleep(250, () => {
        beepTone.pause()
      })
      dialTone.currentTime = 0
      beepTone.currentTime = 0
    })
  }, [])

  const stopListening = useCallback(() => {
    if (!isListening) {
      return
    }
    setIsListening(false)
    function sleep(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }

    sleep(1000).then(() => {
      SpeechRecognition.stopListening()
    })
  }, [isListening])

  useEffect(() => {
    const tmpAnswer = normalizeSpeech(transcript)
    const { handler } = props

    handler(tmpAnswer)
  }, [transcript])

  const { sx } = props

  const style = sx as React.CSSProperties

  return (
    <div style={style}>
      <MicrophoneContainer>
        <MicrophoneIcon
          isListening={isListening}
          onMouseDown={handleListening}
          onMouseUp={stopListening}
          onMouseLeave={stopListening}
        />
        <div>
          <MicrophoneStatus isListening={isListening}>Active</MicrophoneStatus>
          <div> Push to talk</div>
        </div>
      </MicrophoneContainer>
    </div>
  )
}

export default SpeechTextControls
