import React, { ReactElement } from "react"
import { ToggleButton, ToggleButtonGroup } from "../../utils/muiadapter"

type DSState = {
  difficulty: string
}

export default class DifficultySelector extends React.PureComponent<
  Record<string, unknown>,
  DSState
> {
  constructor(props: Record<string, unknown>) {
    super(props)
    this.state = {
      difficulty: "easy",
    }
  }

  handlePicTypeChange = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    value: string
  ): void => {
    if (value !== null) this.setState({ difficulty: value })
  }

  render(): ReactElement {
    const { difficulty } = this.state

    return (
      <ToggleButtonGroup
        value={difficulty}
        exclusive
        onChange={this.handlePicTypeChange}
      >
        <ToggleButton value="easy">Easy</ToggleButton>
        <ToggleButton value="med">Med</ToggleButton>
        <ToggleButton value="hard">Hard</ToggleButton>
        <ToggleButton value="insane">XHard</ToggleButton>
      </ToggleButtonGroup>
    )
  }
}
