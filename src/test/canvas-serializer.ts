/* eslint-disable @typescript-eslint/no-var-requires */
import createCanvasSnapshotSerializer from "./canvasSnapshotSerializer"

const fs = require("fs")
const path = require("path")
const hasha = require("hasha")
const prettyFormat = require("pretty-format")

export default createCanvasSnapshotSerializer(
  fs,
  path,
  hasha,
  prettyFormat,
  expect.getState
)
