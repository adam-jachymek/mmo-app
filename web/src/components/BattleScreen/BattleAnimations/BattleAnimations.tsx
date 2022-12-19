import { useState, useEffect, useMemo } from "react";
import { useSprite } from "react-sprite-animator";

type Props = {
  activeAnimation: string;
};

const BattleAnimations = ({ activeAnimation }: Props) => {
  const [animation, setAnimation] = useState(activeAnimation);

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
      fps: 50,
      scale: 0.7,
      startFrame: 0,
      width: 128,
      height: 128,
    }),
    fireball: useSprite({
      sprite: `/media/animations/fireball.svg`,
      ...options,
      fps: 35,
      scale: 0.8,
      width: 128,
      height: 128,
    }),
  };

  if (animation)
    return (
      <div className="fight__mob-attack" style={animations[activeAnimation]} />
    );

  return null;
};

export default BattleAnimations;
