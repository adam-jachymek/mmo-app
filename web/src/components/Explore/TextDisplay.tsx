import { Button } from "@mantine/core";
import React, { useState, useEffect } from "react";

type Props = {
  text: string[];
  delay: number;
  setShowText: any;
};

const TextDisplay = ({ text, delay, setShowText }: Props) => {
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < text[currentParagraph].length) {
        setDisplayText(
          (prevText) => prevText + text[currentParagraph][currentIndex]
        );
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [currentIndex, delay, text, currentParagraph]);

  useEffect(() => {
    if (currentParagraph === text?.length) {
      setShowText(false);
    }
  }, [currentParagraph, text]);

  const handleContinue = () => {
    setCurrentIndex(0);
    setDisplayText("");
    setCurrentParagraph(currentParagraph + 1);
  };

  return (
    <div onClick={handleContinue} className="explore__text">
      <p>{displayText}</p>
    </div>
  );
};

export default TextDisplay;
