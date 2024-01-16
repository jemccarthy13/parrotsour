/*
  A 'sleep', mostly used for the animation logic
*/
export function sleep(
  ms: number,
  callback: () => void
): { promise: Promise<unknown>; cancel: () => void } {
  let timeout: NodeJS.Timeout
  const promise = new Promise(function (resolve) {
    timeout = setTimeout(function () {
      callback()
      resolve("timeout done")
    }, ms)
  })

  return {
    promise: promise,
    cancel: function () {
      clearTimeout(timeout)
    },
  }
}

/**
 * Format a portion of a timestamp to 2 digits
 * @param time number to format to 2 digits if less than 10
 */
export function formatT(time: number): string {
  let retVal: string = time.toString()

  if (time <= 9) {
    retVal = "0" + time
  }

  return retVal
}

/**
 * Get a HH:mm:ss timestamp (for messages)
 */
export function getTimeStamp(d?: Date): string {
  const date = d ?? new Date()
  const fHours = formatT(date.getHours())
  const fMins = formatT(date.getMinutes())
  const fSecs = formatT(date.getSeconds())

  return fHours + ":" + fMins + ":" + fSecs
}
