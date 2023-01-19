import React, { lazy, Suspense, useState } from "react"
import { PictureAnswer } from "../../canvas/canvastypes"
import { SensorType } from "../../classes/aircraft/datatrail/sensortype"
import { FORMAT } from "../../classes/supportedformats"
import { useAnimationSettings } from "../../hooks/use-animation-settings"
import { useDisplaySettings } from "../../hooks/use-display-settings"
import { ProceduralQT } from "../help/procedural-tips"
import ChatBox from "./chatbox"
import { DifficultySelector } from "./difficultyselector"

const ParrotSourHeader = lazy(() => import("../header/header"))

const DisplayControls = lazy(() => import("../header/display-controls"))
const AnimationControls = lazy(() => import("../header/animation-controls"))

const ProceduralCanvas = lazy(() => import("../../canvas/procedural"))
const VersionInfo = lazy(() => import("../../versioninfo"))

export const ParrotSourProcedural = () => {
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
        <ParrotSourHeader comp={<ProceduralQT />} />
      </Suspense>

      <Suspense fallback={<div />}>
        <DifficultySelector />
      </Suspense>

      <Suspense fallback={<div />}>
        <DisplayControls settings={displaySettings} toggles={displayToggles} />
        <AnimationControls
          handlers={animationHandlers}
          settings={animationSettings}
        />
      </Suspense>

      <Suspense fallback={<div />}>
        <div style={{ display: "inline-flex", width: "100%" }}>
          <ProceduralCanvas
            orientation={displaySettings.canvasConfig}
            braaFirst={displaySettings.isBraaFirst}
            picType="random"
            format={FORMAT.ALSA}
            showMeasurements
            isHardMode
            setAnswer={setAnswer}
            newPic
            sliderSpeed={animationSettings.speedSliderValue}
            animate={animationSettings.isAnimate}
            animateCallback={animationHandlers.startAnimate}
            resetCallback={animationHandlers.pauseAnimate}
            dataStyle={SensorType.ARROW}
            desiredNumContacts={0}
          />

          <ChatBox answer={answer} />
        </div>
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <VersionInfo />
      </Suspense>
    </div>
  )
}

export default ParrotSourProcedural
