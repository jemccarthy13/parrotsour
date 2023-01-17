import React, { ReactElement, useCallback, useState } from "react"
import { PictureAnswer } from "../../canvas/canvastypes"
import { Button, Dialog } from "../../utils/muiadapter"
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
        <Button data-testid="tips-btn" onClick={handleToggleQT}>
          Quick Tips
        </Button>
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
