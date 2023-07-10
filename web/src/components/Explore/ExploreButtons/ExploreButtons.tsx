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

  const [movingData, setMovingData] = useState<{
    axis?: string;
    direction?: number;
  }>();

  useEffect(() => {
    if (isMoving && movingData) {
      socket.emit("moveUser", {
        userId: user.id,
        axis: movingData.axis,
        direction: movingData.direction,
      });
    }
  }, [movingData, isMoving]);

  const handleKeyDown = (event: any, axis: string, direction: number) => {
    if (event.repeat) {
      return;
    }
    setIsMoving(true);
    setMovingData({ axis: axis, direction: direction });
  };

  const handleKeyUp = () => {
    setIsMoving(false);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
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
    };

    const onKeyUp = () => {
      handleKeyUp();
    };

    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("keyup", onKeyUp, false);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
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
