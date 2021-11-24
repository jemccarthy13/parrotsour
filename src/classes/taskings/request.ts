/* istanbul ignore file */

/**
 * Issue #12 - taskings / requests
 */
export class Airspace {
  // temporary. -- flush out how airspaces work
}

//temporary
// -- figure out how AS requests should behave
export class AirspaceRequest {
  location: string | undefined
  alt: number | undefined = 0

  goodLoc = false
  goodAlt = false
}
