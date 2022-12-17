import { useState, useEffect, useMemo } from "react";
import { useSprite } from "react-sprite-animator";

type Props = {
  activeAnimation: string;
};

const BattleAnimations = ({ activeAnimation }: Props) => {
  const [animation, setAnimation] = useState(activeAnimation);

  console.log("animation", animation);

  const options = {
    width: 64,
    height: 64,
    startFrame: 2,
    fps: 25,
    shouldAnimate: activeAnimation,
    stopLastFrame: true,
    scale: 0.5,
    onEnd: () => setAnimation(""),
  };

  const animations: { [key: string]: {} } = {
    sword: useSprite({
      sprite: `/media/animations/sword.svg`,
      ...options,
    }),
    bite: useSprite({
      sprite: `/media/animations/bite.svg`,
      ...options,
    }),
  };

  if (animation)
    return (
      <div className="fight__mob-attack" style={animations[activeAnimation]} />
    );

  return null;
};

export default BattleAnimations;
