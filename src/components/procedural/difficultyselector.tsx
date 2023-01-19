import React, { useCallback, useState } from "react"
import { ToggleButton, ToggleButtonGroup } from "../../utils/muiadapter"

type DifficultyOptions = "easy" | "med" | "hard" | "insane"

export const DifficultySelector = () => {
  const [difficulty, setDifficulty] = useState<DifficultyOptions>("easy")

  const handleDifficultyChange = useCallback(
    (
      _event: React.MouseEvent<HTMLElement, MouseEvent>,
      value: DifficultyOptions
    ): void => {
      if (value !== null) setDifficulty(value)
    },
    []
  )

  return (
    <ToggleButtonGroup
      value={difficulty}
      exclusive
      onChange={handleDifficultyChange}
    >
      <ToggleButton value="easy">Easy</ToggleButton>
      <ToggleButton value="med">Med</ToggleButton>
      <ToggleButton value="hard">Hard</ToggleButton>
      <ToggleButton value="insane">XHard</ToggleButton>
    </ToggleButtonGroup>
  )
}
