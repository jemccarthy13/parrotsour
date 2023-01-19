import { useEffect, useState } from "react"
import { BlueInThe, CanvasOrient } from "../canvas/canvastypes"
import { SensorType } from "../classes/aircraft/datatrail/sensortype"
import {
  BraaFirstCookie,
  DataStyleCookie,
  OrientCookie,
} from "../utils/cookie-constants"
import { useCookieBoolState } from "./use-cookie-bool-state"

export type DisplaySettings = {
  isBraaFirst: boolean
  dataStyle: SensorType
  canvasConfig: CanvasOrient
}

export type DisplayToggles = {
  toggleBraaFirst: () => void
  toggleCanvasOrient: () => void
  toggleDataStyle: () => void
}

export function useDisplaySettings(): {
  state: DisplaySettings
  toggles: DisplayToggles
} {
  const { cookieValue: isBraaFirst, toggleCookie: toggleBraaFirst } =
    useCookieBoolState(BraaFirstCookie)

  const { cookieValue: canvasOrientCookie, toggleCookie: toggleCanvasOrient } =
    useCookieBoolState(OrientCookie)

  /**
   * Issue #18 -- ORIENT -- add support for BlueInThe.N/S/E/W
   */
  const [canvasConfig, setCanvasConfig] = useState<CanvasOrient>({
    height: 500,
    width: 800,
    orient: BlueInThe.EAST,
  })

  useEffect(() => {
    setCanvasConfig(
      canvasOrientCookie
        ? {
            height: 600,
            width: 700,
            orient: BlueInThe.NORTH,
          }
        : {
            height: 500,
            width: 800,
            orient: BlueInThe.EAST,
          }
    )
  }, [canvasOrientCookie])

  const { cookieValue: dataStyleCookie, toggleCookie: toggleDataStyle } =
    useCookieBoolState(DataStyleCookie)
  const [dataStyle, setDataStyle] = useState(
    dataStyleCookie ? SensorType.RAW : SensorType.ARROW
  )

  useEffect(() => {
    setDataStyle(dataStyleCookie ? SensorType.RAW : SensorType.ARROW)
  }, [dataStyleCookie])

  return {
    state: {
      isBraaFirst,
      dataStyle,
      canvasConfig,
    },
    toggles: {
      toggleBraaFirst,
      toggleDataStyle,
      toggleCanvasOrient,
    },
  }
}
