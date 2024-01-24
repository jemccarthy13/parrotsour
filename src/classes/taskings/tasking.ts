/* istanbul ignore file */
import { Point } from "../point"

export type TaskingParams = {
  id?: string
  locationXY?: Point
  locationStr?: string
  description?: string
}

export default class Tasking {
  private taskData: TaskingParams
  constructor(info?: TaskingParams) {
    this.taskData = info ?? {}
  }

  public toString(): string {
    return (
      "// TASKING " +
      this.getID() +
      " // " +
      this.getLocationStr() +
      " // " +
      this.getDescription()
    )
  }

  public getID(): string {
    return this.taskData.id ?? "NONE"
  }

  public getLocationXY(): Point | undefined {
    return this.taskData.locationXY
  }

  public getLocationStr(): string {
    return this.taskData.locationStr ?? "NONE"
  }

  public getDescription(): string {
    return this.taskData.description ?? "NONE"
  }
}
