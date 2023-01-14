import React, { ReactElement } from "react"

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
        Developed by John McCarthy <br />
        Version:&nbsp;
        <a style={{ color: "#7978FD" }} href="/#/changelog.html">
          4.1.2
        </a>
        <br />
        07 Mar 2022 <br />
        <div style={{ fontSize: "8px" }}>
          This website is not affialiated with the United States Government, nor
          sponsored any such entity.
        </div>
      </div>
    )
  }
}
