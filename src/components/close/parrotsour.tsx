/* istanbul ignore file */
import React, { lazy, Suspense, useState } from "react"
import { PictureAnswer } from "../../canvas/canvastypes"
import { SensorType } from "../../classes/aircraft/datatrail/sensortype"
import { FORMAT } from "../../classes/supportedformats"
import { useAnimationSettings } from "../../hooks/use-animation-settings"
import { useDisplaySettings } from "../../hooks/use-display-settings"
import { InterceptQT } from "../help/intercept-tips"
import { CloseCommandBox } from "./commandbox"

const ParrotSourHeader = lazy(() => import("../header/header"))

const DisplayControls = lazy(() => import("../header/display-controls"))
const AnimationControls = lazy(() => import("../header/animation-controls"))

const CloseCanvas = lazy(() => import("../../canvas/close"))
const VersionInfo = lazy(() => import("../../versioninfo"))

export const ParrotSourClose = () => {
  const [answer, setAnswer] = useState<PictureAnswer>({
    pic: "",
    groups: [],
  })

  const { state: displaySettings, toggles: displayToggles } =
    useDisplaySettings()

  const { state: animationSettings, handlers: animationHandlers } =
    useAnimationSettings(answer)

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ParrotSourHeader comp={<InterceptQT />} answer={answer} />
      </Suspense>

      <Suspense fallback={<div />}>
        <DisplayControls settings={displaySettings} toggles={displayToggles} />
        <AnimationControls
          handlers={animationHandlers}
          settings={animationSettings}
        />
      </Suspense>

      <br />

      <br />
      <br />

      <Suspense fallback={<div />}>
        <div style={{ display: "inline-flex", width: "100%" }}>
          <CloseCanvas
            displaySettings={displaySettings}
            animationSettings={animationSettings}
            animationHandlers={animationHandlers}
            setAnswer={setAnswer}
            showMeasurements
            isHardMode={false}
            picType="random"
            format={FORMAT.ALSA}
            newPic={false}
            desiredNumContacts={0}
          />

          <CloseCommandBox answer={answer} />
        </div>
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <VersionInfo />
      </Suspense>
    </div>
  )
}

export default ParrotSourClose
