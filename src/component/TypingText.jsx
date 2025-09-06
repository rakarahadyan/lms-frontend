import { useState, useEffect } from "react";

const TypingText = ({ text = "", speed = 150 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    setDisplayedText(""); // reset setiap text berubah
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  // cursor berkedip
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span>
      {displayedText}
      <span className="inline-block w-1 h-5 bg-gray-800 ml-1 align-middle" style={{ visibility: showCursor ? "visible" : "hidden" }}></span>
    </span>
  );
};

export default TypingText;
