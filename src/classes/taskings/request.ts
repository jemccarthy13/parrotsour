import { formatAlt } from "../../canvas/draw/formatutils"

/**
 * Issue #12 - taskings / requests
 */
export class AirspaceRequest {
  // temporary. -- flush out how airspaces work
  requestedGrid: string = "88AG"
  requestedAlt: number = 0

  toString = () => {
    return this.getGrid() + " FL " + this.getFormattedAlt()
  }

  getFormattedAlt = () => {
    return formatAlt(this.requestedAlt)
  }

  getGrid = () => {
    return this.requestedGrid
  }
}
