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
        comm. The ALSSA ACC comm format is primarily a training supplement to
        help controllers practice ALSSA ACC.
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
        <ListItem>
          Altitudes are <span style={{ color: "orange" }}>&nbsp;gold</span>
        </ListItem>
        <ListItem>
          Bullseye is <span style={{ color: "black" }}>&nbsp;black</span>
        </ListItem>
        <ListItem>
          BRAA is <span style={{ color: "#42a5f5" }}>&nbsp;blue</span>
        </ListItem>
        <br />
      </List>
      <DialogContentText>
        <br />
        <i>
          <b>Fights On</b>
        </i>{" "}
        will animate the red air to simulate an intercept. Red air will turn hot
        to blue and have a chance to maneuver as they get closer.
        <br />
        <i>
          <b>Pause</b>
        </i>{" "}
        will let you suspend the arrows to assess for and voice progressive
        maneuver comm and/or threats.
        <br />
        <br />
      </DialogContentText>
    </DialogContent>
  )
}
