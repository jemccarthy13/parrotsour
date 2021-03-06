/* eslint-disable react/forbid-component-props */
import React, { ReactElement } from "react"
import {
  DialogContent,
  DialogContentText,
  List,
  ListItem,
} from "../../utils/muiadapter"

export const InterceptQT = (): ReactElement => {
  return (
    <DialogContent>
      <DialogContentText>
        This tool is designed to help address controlling deficiencies, such as
        picture building and measuring mechanics, maneuver comm, and threat
        comm. The ALSA ACC comm format is intended as a training supplement to
        help transition from 3-3 IPE to ALSA.
      </DialogContentText>
      <DialogContentText>
        <b>Pictures:</b>
        <br />
        You can select a picture type from the dropdown, or leave it as random.
        <br />- <b>CAPs</b> are limited to azimuth only for now
        <br />- <b>Hard Mode</b> will randomize the track direction for each
        group <br />- <b>Picture of the Day </b> is a random number (5-11) of
        groups, and gives <b>core</b> as the answer
      </DialogContentText>
      <DialogContentText>
        The &quot;I would like to measure&quot; option will omit BRAA and
        bullseye measurements, and allow you to click and drag to measure the
        picture.
      </DialogContentText>
      <i>Color Code:</i>
      <List dense>
        <ListItem style={{ border: "none" }}>
          Altitudes are <span style={{ color: "orange" }}>&nbsp;gold</span>
        </ListItem>
        <ListItem style={{ border: "none" }}>
          Bullseye is <span style={{ color: "black" }}>&nbsp;black</span>
        </ListItem>
        <ListItem style={{ border: "none" }}>
          BRAA is <span style={{ color: "blue" }}>&nbsp;blue</span>
        </ListItem>
        <br />
      </List>
      <DialogContentText>
        <b>Fights On</b>
        <br />
        This button will animate the red air to simulate an intercept. Red air
        will turn hot to blue and have a chance to maneuver as they get closer.
        <br />
        <i>Measuring</i> during the fight will suspend the arrows, to asses for
        and voice maneuvers and/or threats.
        <br />
        <i>Pause</i> will let you suspend the arrows to voice progressive
        maneuver comm.
        <br />
        <br />
      </DialogContentText>
    </DialogContent>
  )
}
