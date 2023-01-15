import React from "react"
import { ReactComponent as ParrotSourSVG } from "../../icon/parrotsour-logo-color.svg"

export const Maintenance = () => {
  return (
    <div style={{ textAlign: "center", margin: "auto", marginTop: "80px" }}>
      <ParrotSourSVG height={300} width={300} />{" "}
      <div style={{ fontFamily: "Arial", fontSize: "32px" }}>
        This parrot is sour.
      </div>
      <br />
      <div style={{ fontFamily: "Arial", fontSize: "22px" }}>
        But we are recycling and will be back shortly.
      </div>
      <br />
      <br />
      <div style={{ fontFamily: "Arial", fontSize: "16px" }}>
        We&lsquo;re busy updating the site for you.
      </div>
    </div>
  )
}
