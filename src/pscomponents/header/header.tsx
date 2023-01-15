import React, { ReactElement, useCallback, useState } from "react"
import { PictureAnswer } from "../../canvas/canvastypes"
import { Dialog } from "../../utils/muiadapter"
import IssueReport from "../issues/report-form"

interface PSHeaderProps {
  comp?: ReactElement
  answer?: PictureAnswer
}

/**
 * ParrotSour top header. Includes controls for:
 *
 * - Quick Tips
 * - Issue Report
 */
export const ParrotSourHeader = ({
  comp = <></>,
  answer = { pic: "", groups: [] },
}: PSHeaderProps) => {
  const [isShowQT, setShowQT] = useState(false)

  /** Toggle display of the QuickTips Dialog Element (component passed in props) */
  const handleToggleQT = useCallback((): void => {
    setShowQT((prev) => !prev)
  }, [])

  return (
    <div>
      <div style={{ display: "flex" }}>
        <button
          data-testid="tips-btn"
          id="quickTipBtn"
          type="button"
          style={{ width: "25%", top: "5px" }}
          onClick={handleToggleQT}
        >
          Quick Tips
        </button>
        {isShowQT && (
          <Dialog id="quickTipDialog" open={isShowQT} onClose={handleToggleQT}>
            {comp}
          </Dialog>
        )}
        <IssueReport answer={answer} />
      </div>
    </div>
  )
}

export default ParrotSourHeader
