import { Animator } from "../animation/use-animator"
import { AircraftGroup } from "../classes/groups/group"
import { Point } from "../classes/point"
import { FORMAT } from "../classes/supportedformats"
import {
  AnimationHandlers,
  AnimationSettings,
} from "../hooks/use-animation-settings"
import { DisplaySettings } from "../hooks/use-display-settings"

export enum BlueInThe {
  NORTH,
  SOUTH,
  EAST,
  WEST,
}

export class FightAxis {
  public static isNS(orientation: BlueInThe): boolean {
    return orientation === BlueInThe.NORTH || orientation === BlueInThe.SOUTH
  }
}

export class CanvasOrient {
  height = 0
  width = 0
  orient = BlueInThe.EAST
}

export type CanvasProps = {
  displaySettings: DisplaySettings
  showMeasurements: boolean
  isHardMode: boolean
  newPic: boolean
  picType: string
  animationSettings: AnimationSettings
  animationHandlers: AnimationHandlers
}

export type PicCanvasProps = PSCanvasProps & {
  format: FORMAT
  setAnswer: { (answer: PictureAnswer): void }
  desiredNumContacts: number
  animator: Animator
}

export type PSCanvasProps = {
  displaySettings: DisplaySettings
  showMeasurements: boolean
  isHardMode: boolean
  newPic: boolean
  picType: string
  bullseye: Point
  answer: PictureAnswer
  animateCanvas?: ImageData
  blueAir: AircraftGroup
  animationSettings: AnimationSettings
  animationHandlers: AnimationHandlers
  reDraw: () => PictureAnswer
  draw: () => Promise<void>
  animator: Animator
}

export type PictureAnswer = {
  pic: string
  groups: AircraftGroup[]
}

export type PictureCanvasProps = CanvasProps & {
  format: FORMAT
  setAnswer: { (answer: PictureAnswer): void }
  desiredNumContacts: number
}

export interface PictureCanvasState {
  bullseye: Point
  blueAir: AircraftGroup
  answer: PictureAnswer
  reDraw: (forced?: boolean, start?: Point, hasCaps?: boolean) => PictureAnswer
  animateCanvas?: ImageData
}

export interface DrawCanvasProps extends CanvasProps {
  draw: (context: CanvasRenderingContext2D) => Promise<void>
  bullseye: Point
  answer: PictureAnswer
}
