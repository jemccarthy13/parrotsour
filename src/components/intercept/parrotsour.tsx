import React, { lazy, Suspense, useCallback, useState } from "react"
import { Typography } from "@mui/material"
import { PictureAnswer } from "../../canvas/canvastypes"
import { FORMAT } from "../../classes/supportedformats"
import { useAnimationSettings } from "../../hooks/use-animation-settings"
import { useCookieBoolState } from "../../hooks/use-cookie-bool-state"
import { useDisplaySettings } from "../../hooks/use-display-settings"
import { HardModeCookie, WantMeasureCookie } from "../../utils/cookie-constants"
import { Button, SelectChangeEvent } from "../../utils/muiadapter"
import { ExpandMoreIcon, ExpandLessIcon } from "../../utils/muiiconadapter"
import { NumberSelector } from "../fields/number-selector"
import { InterceptQT } from "../help/intercept-tips"
import { AnswerContainer } from "./styles"

const ParrotSourHeader = lazy(() => import("../header/header"))

const DisplayControls = lazy(() => import("../header/display-controls"))
const AnimationControls = lazy(() => import("../header/animation-controls"))

const PicTypeSelector = lazy(() => import("./picoptions"))
const StandardSelector = lazy(() => import("./standardselector"))

const PictureCanvas = lazy(() => import("../../canvas/intercept"))
const VersionInfo = lazy(() => import("../../versioninfo"))

/**
 * A Component to display intercept pictures on an HTML5 canvas
 */
export const ParrotSourIntercept = () => {
  const [showAnswer, setShowAnswer] = useState(false)

  const { cookieValue: userWantsToMeasure, toggleCookie: toggleShowMeasure } =
    useCookieBoolState(WantMeasureCookie)
  const { cookieValue: isHardMode, toggleCookie: toggleHardMode } =
    useCookieBoolState(HardModeCookie)

  const [format, setFormat] = useState(FORMAT.ALSA)
  const [picType, setPicType] = useState("random")
  const [isNewPic, setNewPic] = useState(false)
  const [desiredNumContacts, setDesiredNumContacts] = useState(0)

  const [answer, setAnswer] = useState<PictureAnswer>({
    pic: "",
    groups: [],
  })

  const { state: displaySettings, toggles: displayToggles } =
    useDisplaySettings()

  const { state: animationSettings, handlers: animationHandlers } =
    useAnimationSettings(answer)

  /**
   * Called to display a new Picture
   */
  const onNewPic = useCallback((): void => {
    animationHandlers.pauseAnimate()
    setNewPic((prev) => !prev)
  }, [])

  /**
   * Called when the format selection changes
   * @param fmt - new format to use to generate answers
   */
  const handleFormatSelChange = useCallback((fmt: FORMAT) => {
    setFormat(fmt)
    onNewPic()
  }, [])

  /**
   * Toggle the answer collapsible
   */
  const handleRevealPic = useCallback(() => {
    setShowAnswer((prev) => !prev)
  }, [])

  /**
   * Update the count of contacts
   */
  const updateCounter = useCallback((count: number) => {
    setDesiredNumContacts(count)
  }, [])

  /**
   * Called when the picture type selector changes values
   * @param e - ChangeEvent for the Select element
   */
  const onChangePicType = useCallback((e: SelectChangeEvent<string>): void => {
    setPicType(`${e.target.value}`)
  }, [])

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ParrotSourHeader comp={<InterceptQT />} answer={answer} />
      </Suspense>

      <Suspense fallback={<div />}>
        <StandardSelector onChange={handleFormatSelChange} />
        <NumberSelector id="numContacts" updateCount={updateCounter} />
      </Suspense>

      <Suspense fallback={<div />}>
        <DisplayControls settings={displaySettings} toggles={displayToggles} />
        <AnimationControls
          handlers={animationHandlers}
          settings={animationSettings}
        />
      </Suspense>

      <Suspense fallback={<div />}>
        <PicTypeSelector
          handleChangePicType={onChangePicType}
          picType={picType}
          handleToggleHardMode={toggleHardMode}
          handleToggleMeasurements={toggleShowMeasure}
          handleNewPic={onNewPic}
        />
      </Suspense>

      <div style={{ marginBottom: "24px" }}>
        <Button
          sx={{ width: "25%", height: "38px", borderRadius: "0px" }}
          onClick={handleRevealPic}
          disableRipple
        >
          <span style={{ display: "contents", height: "100%" }}>
            Reveal Pic
            <Typography
              sx={{
                alignSelf: "center",
                marginLeft: "auto",
              }}
            >
              {showAnswer ? (
                <ExpandLessIcon sx={{ display: "block", height: "100%" }} />
              ) : (
                <ExpandMoreIcon sx={{ display: "block", height: "100%" }} />
              )}
            </Typography>
          </span>
        </Button>

        {showAnswer && (
          <AnswerContainer>{answer ? answer.pic : <div />}</AnswerContainer>
        )}
      </div>

      <Suspense fallback={<div />}>
        <PictureCanvas
          orientation={displaySettings.canvasConfig}
          braaFirst={displaySettings.isBraaFirst}
          dataStyle={displaySettings.dataStyle}
          picType={picType}
          format={format}
          showMeasurements={!userWantsToMeasure}
          isHardMode={isHardMode}
          setAnswer={setAnswer}
          newPic={isNewPic}
          sliderSpeed={animationSettings.speedSliderValue}
          animate={animationSettings.isAnimate}
          animateCallback={animationHandlers.startAnimate}
          resetCallback={animationHandlers.pauseAnimate}
          desiredNumContacts={desiredNumContacts}
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <VersionInfo />
      </Suspense>
    </div>
  )
}

export default ParrotSourIntercept
