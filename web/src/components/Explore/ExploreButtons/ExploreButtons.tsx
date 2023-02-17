import { socket } from "api/socket";

import "./styles.sass";

type Props = {
  user: any;
};

const ExploreDpad = ({ user }: Props) => {
  return (
    <div className="explore-dpad">
      <div className="explore-dpad__wrapper">
        <button
          style={{
            backgroundImage: "url(/media/explore/joystick-arrow-left.svg)",
            backgroundSize: "cover",
          }}
          className="explore-dpad__left"
          onClick={() => {
            socket.emit("moveUser", {
              userId: user.id,
              axis: "x",
              direction: -1,
            });
          }}
        >
          {/* <img src="/media/explore/joystick-arrow-left.svg" /> */}
        </button>
        <button
          className="explore-dpad__right"
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
        >
          {/* <img src="/media/explore/joystick-arrow-right.svg" /> */}
        </button>
        <button
          className="explore-dpad__down"
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
        >
          {/* <img src="/media/explore/joystick-arrow-down.svg" /> */}
        </button>
        <button
          className="explore-dpad__up"
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
        >
          {/* <img src="/media/explore/joystick-arrow-up.svg" /> */}
        </button>
      </div>
    </div>
  );
};

export default ExploreDpad;
