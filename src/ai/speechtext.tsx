import React, { ReactElement, useCallback, useEffect, useState } from "react"
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"
import { normalizeSpeech } from "./process-speech"
import { MicrophoneContainer, MicrophoneIcon, MicrophoneStatus } from "./styles"

interface SpeechTextProps {
  handler: (msgText: string) => void
}

export function SpeechTextControls(props: SpeechTextProps): ReactElement {
  const { finalTranscript: transcript, resetTranscript } =
    useSpeechRecognition()
  const [isListening, setIsListening] = useState(false)

  const handleListening = useCallback(() => {
    resetTranscript()
    setIsListening(true)

    SpeechRecognition.startListening({
      continuous: true,
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

  return (
    <div>
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
