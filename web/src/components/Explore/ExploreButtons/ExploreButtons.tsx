import { Button } from "@mantine/core";
import { socket } from "api/socket";
import { useEffect, useState } from "react";

import "./styles.sass";

type Props = {
  user: any;
  showJonhText: any;
};

const ExploreDpad = ({ user, showJonhText }: Props) => {
  const [isMoving, setIsMoving] = useState(false);

  const [movingData, setMovingData] = useState({
    axis: "",
    direction: 0,
  });

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;

    if (isMoving) {
      socket.emit("moveUser", {
        userId: user.id,
        axis: movingData.axis,
        direction: movingData.direction,
      });
    }

    return () => clearInterval(intervalId);
  }, [isMoving, movingData]);

  const handleKeyDown = (event: any, axis: string, direction: number) => {
    if (event.repeat) {
      return;
    }
    setMovingData({ axis: axis, direction: direction });
    setIsMoving(true);
  };

  const handleKeyUp = () => {
    setIsMoving(false);
  };

  useEffect(() => {
    window.addEventListener(
      "keydown",
      (e) => {
        if (e.code === "KeyD") {
          handleKeyDown(e, "x", 1);
        }
        if (e.code === "KeyA") {
          handleKeyDown(e, "x", -1);
        }
        if (e.code === "KeyW") {
          handleKeyDown(e, "y", -1);
        }
        if (e.code === "KeyS") {
          handleKeyDown(e, "y", 1);
        }
      },
      false
    );
    window.addEventListener(
      "keyup",
      (e) => {
        if (e.code === "KeyD") {
          handleKeyUp();
        }
        if (e.code === "KeyA") {
          handleKeyUp();
        }
        if (e.code === "KeyW") {
          handleKeyUp();
        }
        if (e.code === "KeyS") {
          handleKeyUp();
        }
      },
      false
    );
  }, [window]);

  return (
    <div className="explore-buttons">
      <div className="explore-buttons__dpad">
        <Button
          style={{
            backgroundImage: "url(/media/explore/joystick-arrow-left.svg)",
            backgroundSize: "cover",
          }}
          className="explore-buttons__left button"
          onTouchStart={(e) => {
            handleKeyDown(e, "x", -1);
          }}
          onTouchEnd={(e) => {
            handleKeyUp();
          }}
          onMouseDown={(e) => {
            handleKeyDown(e, "x", -1);
          }}
          onMouseUp={() => {
            handleKeyUp();
          }}
        ></Button>

        <Button
          className="explore-buttons__right button"
          style={{
            backgroundImage: "url(/media/explore/joystick-arrow-right.svg)",
            backgroundSize: "cover",
          }}
          onMouseDown={(e) => {
            handleKeyDown(e, "x", 1);
          }}
          onMouseUp={() => {
            handleKeyUp();
          }}
          onTouchStart={(e) => {
            handleKeyDown(e, "x", 1);
          }}
          onTouchEnd={() => {
            handleKeyUp();
          }}
        ></Button>
        <Button
          className="explore-buttons__down button"
          style={{
            backgroundImage: "url(/media/explore/joystick-arrow-down.svg)",
            backgroundSize: "cover",
          }}
          onMouseDown={(e) => {
            handleKeyDown(e, "y", 1);
          }}
          onMouseUp={() => {
            handleKeyUp();
          }}
          onTouchStart={(e) => {
            handleKeyDown(e, "y", 1);
          }}
          onTouchEnd={() => {
            handleKeyUp();
          }}
        ></Button>
        <Button
          className="explore-buttons__up button"
          style={{
            backgroundImage: "url(/media/explore/joystick-arrow-up.svg)",
            backgroundSize: "cover",
          }}
          onMouseDown={(e) => {
            handleKeyDown(e, "y", -1);
          }}
          onMouseUp={() => {
            handleKeyUp();
          }}
          onTouchStart={(e) => {
            handleKeyDown(e, "y", -1);
          }}
          onTouchEnd={() => {
            handleKeyUp();
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
