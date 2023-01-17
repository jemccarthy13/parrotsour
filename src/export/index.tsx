/* istanbul ignore file */
import DrawingCanvas from "../canvas/drawingcanvas"
import PictureCanvas from "../canvas/picturecanvas"
import ParrotSourControls from "../pscomponents/header/controls"
import { ParrotSourHeader } from "../pscomponents/header/header"
import { AlsaHelp } from "../pscomponents/help/alsa-tips"
import { InterceptQT } from "../pscomponents/help/intercept-tips"
import { PsQT } from "../pscomponents/help/ps-tips"
import { ParrotSourChooser } from "../pscomponents/home/chooser"
import { ParrotSour } from "../pscomponents/home/parrotsour"
import ParrotSourIntercept from "../pscomponents/intercept/parrotsourintercept"
import PicOptionsBar from "../pscomponents/intercept/picoptionsbar"
import { StandardSelector } from "../pscomponents/intercept/standardselector"
import ParrotSourProcedural from "../pscomponents/procedural/parrotsourprocedural"

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
