// Classes & Interfaces
import { getAsset } from "../../ai/getAsset"
import { processCloseLayer } from "../../ai/languageprocessors/closelayer"
import { processElevatorLayer } from "../../ai/languageprocessors/elevatorlayer"
import { processMoveLayer } from "../../ai/languageprocessors/movelayer"
import { AIProcessor } from "../../ai/languageprocessors/nlprocessor"
import { processQuestionLayer } from "../../ai/languageprocessors/questionlayer"
import { processRadioCheckLayer } from "../../ai/languageprocessors/radiochecklayer"
import { PictureAnswer } from "../../canvas/canvastypes"
import { AircraftGroup } from "../../classes/groups/group"
import { convertToXY } from "./cgrshelpers"

/**
 * This function mutates the original string to replace cgrs with
 * canvas x,y coordinates, and returns a list of matching CGRS coordinates
 * in the order they were found.
 *
 * @param msgText Text to parse
 * @returns An object containing {
 *  cgrs: array of CGRS coordinates in the order they were found in the text,
 *  newText: the message with all CGRS coordinates replaced with x,y canvas coords
 * }
 */
function _findAndReplaceCGRS(msgText: string): {
  cgrs: string[]
  msgText: string
} {
  let textToParse = msgText.toUpperCase()
  const re = /(\d+[A-Z]+\d*)/
  const matches = RegExp(re).exec(textToParse)
  const cgrs: string[] = []

  if (matches) {
    matches.forEach((elem) => {
      const xy = convertToXY(elem)

      textToParse = textToParse.replace(elem, xy.x + " " + xy.y)
      cgrs.push(elem)
    })
  }
  textToParse = textToParse.toLowerCase()

  return { cgrs, msgText: textToParse }
}

/**
 * Search the groups for an asset whose callsign matches
 *
 * @param nl the compromise NLProcessor
 * @param groups answer.groups
 * @param sendResponse callback, how to send messages
 * @returns AircraftGroup if found
 */
function _checkForAsset(
  processedText: string,
  groups: AircraftGroup[],
  sendResponse: (sender: string, msg: string) => void
): AircraftGroup | undefined {
  const nl = AIProcessor.process(processedText)
  const assetMsg = nl.match("#Noun").first()
  const cs = assetMsg.text()
  const callsign = cs ? cs.toUpperCase() : "SYSTEM"
  const asset = getAsset(groups, callsign)

  if (callsign === "SYSTEM") {
    sendResponse("SYSTEM", "I don't understand")
  }

  if (!asset) {
    sendResponse("SYSTEM", `No such callsign (${callsign})`)
  }

  return asset
}

/**
 * This function is loosely based on a Turing machine and/or neural networks.
 *
 * It is not as complicated, not predictive, and doesn't 'learn', but the general
 * idea is that given a message, I will pass the message through different layers
 * that rely on a previous layers output (similar to 'neurons' in a nerual network,
 * but more closely resembling Turing theory of symbol manipulation).
 *
 * Each layer will take the message, determine if it understands what is
 * being said, asked, or commanded. Then the layer will 'consume' what it
 * understood and give the rest of the message to the next layer to figure out.
 *
 * If there is text leftover, a portion of the message could not be interpreted.
 *
 * @param msg the whole message to try and understand / process
 * @param answer contains data on aircraft location
 * @param sendResponse callback; how to respond to messages
 */
export function aiProcess(
  msg: { text: string; voice: boolean },
  answer: PictureAnswer,
  sendResponse: (sender: string, msg: string, voice?: boolean) => void
): void {
  // first layer is replacing all CGRS coordinates with canvas x,y
  const { msgText, cgrs } = _findAndReplaceCGRS(msg.text)

  // next we 'normalize' the message
  let processedText = msgText.replaceAll("/", " ")

  if (processedText.trim() === "") {
    return
  }

  const asset = _checkForAsset(processedText, answer.groups, sendResponse)

  if (!asset) {
    return
  }

  const callsign = asset.getLabel()

  const sendResponseWrapper = (sender: string, text: string) => {
    sendResponse(sender, text, msg.voice)
  }

  // first we look for any questions
  processedText = processQuestionLayer(
    processedText,
    sendResponseWrapper,
    asset
  )

  processedText = processMoveLayer(
    processedText,
    sendResponseWrapper,
    asset,
    cgrs,
    msg.voice
  )

  processedText = processCloseLayer(processedText, sendResponseWrapper, asset)

  processedText = processElevatorLayer(
    processedText,
    sendResponseWrapper,
    asset,
    msg.voice
  )

  processedText = processRadioCheckLayer(
    processedText,
    sendResponseWrapper,
    asset,
    msg.voice
  )

  if (processedText.length > 0) {
    sendResponse(callsign, "I don't understand " + processedText)
  }
}
