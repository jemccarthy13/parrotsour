import { styled } from "@mui/system"

export const MicrophoneContainer = styled("div")`
  display: flex;
  align-items: center;
  width: 100%;
`

type MicrophoneIconProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  isListening: boolean
}

const shouldForwardMicroProp = (prop: string) => prop != "isListening"

export const MicrophoneIcon = styled("div", {
  shouldForwardProp: shouldForwardMicroProp,
})<MicrophoneIconProps>`
  border-radius: 50%;
  background-image: ${({ isListening }) =>
    isListening
      ? "linear-gradient(128deg, #32Cd32, #32Cd32)"
      : "linear-gradient(128deg, #ffffff, #647c88)"};
  margin-right: 16px;
  position: relative;
  cursor: pointer;
  height: 42px;
  width: 42px;
`

export const MicrophoneStatus = styled("div", {
  shouldForwardProp: shouldForwardMicroProp,
})<MicrophoneIconProps>`
  font-size: 22px;
  color: ${({ isListening }) => (isListening ? "#32Cd32" : "unset")};
`
