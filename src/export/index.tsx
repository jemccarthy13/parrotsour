/* istanbul ignore file */
import DrawingCanvas from "../canvas/drawingcanvas"
import PictureCanvas from "../canvas/picturecanvas"
import ParrotSourControls from "../components/header/controls"
import { ParrotSourHeader } from "../components/header/header"
import { AlsaHelp } from "../components/help/alsa-tips"
import { InterceptQT } from "../components/help/intercept-tips"
import { PsQT } from "../components/help/ps-tips"
import { ParrotSourChooser } from "../components/home/chooser"
import { ParrotSour } from "../components/home/parrotsour"
import ParrotSourIntercept from "../components/intercept/parrotsourintercept"
import PicOptionsBar from "../components/intercept/picoptionsbar"
import { StandardSelector } from "../components/intercept/standardselector"
import ParrotSourProcedural from "../components/procedural/parrotsourprocedural"

export {
  DrawingCanvas as Canvas,
  PictureCanvas,
  ParrotSourIntercept,
  PicOptionsBar as PicTypeSelector,
  StandardSelector,
  ParrotSourProcedural,
  AlsaHelp,
  InterceptQT,
  PsQT,
  ParrotSour,
  ParrotSourControls,
  ParrotSourHeader,
  ParrotSourChooser,
}
