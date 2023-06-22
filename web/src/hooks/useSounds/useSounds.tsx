import { useEffect } from "react";
import useSound from "use-sound";
import sword from "./audio/sword.mp3";
import fireball from "./audio/fireball.mp3";
import bite from "./audio/bite.mp3";

const useSounds = (activeSound?: string) => {
  const sounds: { [key: string]: any } = {
    sword: useSound(sword),
    fireball: useSound(fireball),
    bite: useSound(bite),
  };

  useEffect(() => {
    if (activeSound) {
      const [playSound] = sounds[activeSound];
      playSound();
    }
  }, [activeSound]);
};

export default useSounds;
