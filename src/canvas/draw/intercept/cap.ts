import { AircraftGroup } from "../../../classes/groups/group"
import { randomNumber } from "../../../utils/math"

export const checkCaps = (hasCaps: boolean, grps: AircraftGroup[]): void => {
  if (hasCaps) {
    let numCaps = randomNumber(1, grps.length - 1)

    while (numCaps > 0) {
      const idx = randomNumber(0, grps.length - 1)

      grps[idx].setCapping(true)
      numCaps--
    }
  } else {
    grps.forEach((grp) => {
      grp.setCapping(false)
    })
  }
}
