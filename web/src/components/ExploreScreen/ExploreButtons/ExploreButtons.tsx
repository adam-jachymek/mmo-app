import { socket } from "api/socket";

import "./styles.sass";

type Props = {
  user: any;
};

const ExploreButtons = ({ user }: Props) => {
  return (
    <div className="explore-buttons">
      <div className="explore-buttons__wrapper">
        <button
          className="explore-buttons__left"
          onClick={() => {
            socket.emit("moveUser", {
              userId: user.id,
              axis: "x",
              direction: -1,
            });
          }}
        >
          <img src="/media/explore/joystick-arrow-left.svg" />
        </button>
        <button
          className="explore-buttons__right"
          onClick={() => {
            socket.emit("moveUser", {
              userId: user.id,
              axis: "x",
              direction: 1,
            });
          }}
        >
          <img src="/media/explore/joystick-arrow-right.svg" />
        </button>
        <button
          className="explore-buttons__down"
          onClick={() => {
            socket.emit("moveUser", {
              userId: user.id,
              axis: "y",
              direction: 1,
            });
          }}
        >
          <img src="/media/explore/joystick-arrow-down.svg" />
        </button>
        <button
          className="explore-buttons__up"
          onClick={() => {
            socket.emit("moveUser", {
              userId: user.id,
              axis: "y",
              direction: -1,
            });
          }}
        >
          <img src="/media/explore/joystick-arrow-up.svg" />
        </button>
      </div>
    </div>
  );
};

export default ExploreButtons;
