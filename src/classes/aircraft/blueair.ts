import { AircraftGroup } from "../groups/group"

export class BlueAir {
  private static blue: AircraftGroup

  public static set(grp: AircraftGroup): void {
    this.blue = grp
  }

  public static get(): AircraftGroup {
    return this.blue
  }
}
