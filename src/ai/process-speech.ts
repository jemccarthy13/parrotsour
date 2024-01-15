export function normalizeSpeech(transcript: string) {
  let tmpAnswer = transcript

  tmpAnswer = tmpAnswer
    .replaceAll("golf", "gulf")
    .replaceAll("proseed", "proceed")
    .replaceAll("precede", "proceed")
  tmpAnswer = tmpAnswer.replaceAll("vapour", "viper")
  tmpAnswer = tmpAnswer.replaceAll("elevator", "elevate")
  tmpAnswer = tmpAnswer.replaceAll("positive", "posit")

  tmpAnswer = tmpAnswer.replaceAll("flight level", "FL")
  tmpAnswer = tmpAnswer.replaceAll("flight Level", "FL")

  // TODO - less capture, then [0], [-1] to get first and last characters to build vcs
  // eslint-disable-next-line regexp/optimal-quantifier-concatenation
  const re = new RegExp(/^([A-Z])[A-Z]*([A-Z]) *(\d)\d*(\d)/i)
  const match = RegExp(re).exec(tmpAnswer)

  if (match) {
    const let1 = match[1]
    const let2 = match[2]
    const num1 = match[3]
    const num2 = match[4]
    const vcs = let1 + let2 + num1 + num2

    tmpAnswer = tmpAnswer.replace(match[0], vcs.toUpperCase())
  }

  return tmpAnswer
}
