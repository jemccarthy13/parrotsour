import React, { CSSProperties, ReactElement } from "react"

import IssueReport from "./issues/issuereport"
import { PictureAnswer } from "canvas/canvastypes"
import { Dialog } from "../utils/muiadapter"

interface PSHeaderProps {
  comp?: ReactElement
  answer?: PictureAnswer
}

interface PSHeaderState {
  showQT: boolean
}

/**
 * ParrotSour top header. Includes controls for:
 *
 * - Quick Tips
 * - Issue Report
 * - 552 Logos
 */
export default class ParrotSourHeader extends React.PureComponent<
  PSHeaderProps,
  PSHeaderState
> {
  constructor(props: PSHeaderProps) {
    super(props)
    this.state = {
      showQT: false,
    }
  }

  imgStyle: CSSProperties = {
    position: "absolute",
    height: "60px",
    top: "5px",
  }

  /**
   * Toggle display of the QuickTips Dialog Element (component passed in props)
   */
  handleToggleQT = (): void => {
    const { showQT } = this.state
    this.setState({ showQT: !showQT })
  }

  render(): ReactElement {
    const { showQT } = this.state
    const { comp, answer } = this.props
    return (
      <div>
        {/* <img
          src="/icon/trans.png"
          style={{ ...this.imgStyle, right: "5%" }}
          id="wglogo"
          alt="logo"
        />
    */}

        <div style={{ display: "flex" }}>
          <button
            id="quickTipBtn"
            type="button"
            style={{ width: "25%", top: "5px" }}
            onClick={this.handleToggleQT}
          >
            Quick Tips
          </button>
          {showQT && (
            <Dialog
              id="quickTipDialog"
              open={showQT}
              onClose={this.handleToggleQT}
            >
              {comp}
            </Dialog>
          )}
          <IssueReport answer={answer} />
        </div>
      </div>
    )
  }
}

//@ts-expect-error defaultProps is req for compile
ParrotSourHeader.defaultProps = {
  comp: <></>,
  answer: { pic: "", groups: [] },
}
