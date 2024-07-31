import React from "react";

const { useEffect, useState, useRef } = React;

export const useTypewriter = (text: string, speed = 20) => {
  const [displayText, setDisplayText] = useState("");
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const typeCharacter = () => {
      if (indexRef.current < text.length) {
        setDisplayText((prevText) => prevText + text.charAt(indexRef.current));
        indexRef.current += 1;
        timeoutRef.current = setTimeout(typeCharacter, speed);
      }
    };

    indexRef.current = 0; // Reset index when text changes
    setDisplayText(""); // Reset displayText when text changes
    typeCharacter();
  }, [text, speed]);

  return displayText;
};
