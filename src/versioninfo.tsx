import React, { ReactElement } from "react"
import { ReactComponent as ParrotSourSVG } from "./icon/parrotsour-logo-color.svg"

/**
 * Component to display versioning information at the bottom of PS sites
 */
export default class VersionInfo extends React.PureComponent {
  vStyle = {
    color: "lightblue",
    paddingTop: "200px",
    paddingBottom: "20px",
    fontSize: 18,
  }

  render(): ReactElement {
    return (
      <div data-testid="version-info" id="vInfo" style={this.vStyle}>
        <div>
          <div
            style={{
              display: "inline",
              paddingRight: "8px",
              verticalAlign: "middle",
            }}
          >
            <ParrotSourSVG width={32} height={32} />
          </div>
          Developed by John McCarthy
        </div>
        <div style={{ paddingLeft: "40px", marginBottom: "4px" }}>
          Version:&nbsp;
          <a style={{ color: "#7978FD" }} href="/#/changelog">
            {`${process.env.REACT_APP_VERSION}`}
          </a>
        </div>
        <div style={{ paddingLeft: "40px", marginBottom: "4px" }}>
          15 Jan 2023 <br />
        </div>
        <div style={{ fontSize: "8px", paddingLeft: "40px" }}>
          This website is not affialiated with the United States Government, nor
          sponsored any such entity.
        </div>
      </div>
    )
  }
}
