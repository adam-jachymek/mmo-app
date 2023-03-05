import { Button } from "@mantine/core";
import { socket } from "api/socket";

import "./styles.sass";

type Props = {
  user: any;
  showJonhText: any;
};

const ExploreDpad = ({ user, showJonhText }: Props) => {
  return (
    <div className="explore-buttons">
      <div className="explore-buttons__dpad">
        <Button
          style={{
            backgroundImage: "url(/media/explore/joystick-arrow-left.svg)",
            backgroundSize: "cover",
          }}
          className="explore-buttons__left button"
          onClick={() => {
            socket.emit("moveUser", {
              userId: user.id,
              axis: "x",
              direction: -1,
            });
          }}
        ></Button>
        <Button
          className="explore-buttons__right button"
          style={{
            backgroundImage: "url(/media/explore/joystick-arrow-right.svg)",
            backgroundSize: "cover",
          }}
          onClick={() => {
            socket.emit("moveUser", {
              userId: user.id,
              axis: "x",
              direction: 1,
            });
          }}
        ></Button>
        <Button
          className="explore-buttons__down button"
          style={{
            backgroundImage: "url(/media/explore/joystick-arrow-down.svg)",
            backgroundSize: "cover",
          }}
          onClick={() => {
            socket.emit("moveUser", {
              userId: user.id,
              axis: "y",
              direction: 1,
            });
          }}
        ></Button>
        <Button
          className="explore-buttons__up button"
          style={{
            backgroundImage: "url(/media/explore/joystick-arrow-up.svg)",
            backgroundSize: "cover",
          }}
          onClick={() => {
            socket.emit("moveUser", {
              userId: user.id,
              axis: "y",
              direction: -1,
            });
          }}
        ></Button>
      </div>
      <div className="explore-buttons__ab">
        <Button
          className="explore-buttons__a button"
          variant="subtle"
          style={{
            backgroundImage: "url(/media/explore/button-a.png)",
            backgroundSize: "cover",
          }}
          onClick={() => {
            showJonhText();
          }}
        ></Button>
        <Button
          className="explore-buttons__b button"
          variant="subtle"
          style={{
            backgroundImage: "url(/media/explore/button-b.png)",
            backgroundSize: "cover",
          }}
          onClick={() => {}}
        ></Button>
      </div>
    </div>
  );
};

export default ExploreDpad;
