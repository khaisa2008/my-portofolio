"use client";

import { useEffect, useState } from "react";

export default function useMethod() {
  const finalText = "MY PORTFOLIO";

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const [displayText, setDisplayText] = useState("");

  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let currentIndex = 0;

    let scrambleInterval: NodeJS.Timeout;

    const startAnimation = () => {
      setFinished(false);

      currentIndex = 0;

      revealNextLetter();
    };

    const revealNextLetter = () => {
      let scrambleCount = 0;

      scrambleInterval = setInterval(() => {
        const visibleText = finalText.slice(0, currentIndex);

        const scrambled = finalText
          .split("")
          .map((char, index) => {
            if (index < currentIndex) {
              return finalText[index];
            }

            if (index === currentIndex) {
              return chars[Math.floor(Math.random() * chars.length)];
            }

            return "";
          })
          .join("");

        // efek muncul dari tengah
        const padding = " ".repeat(finalText.length - visibleText.length);

        setDisplayText(padding + scrambled);

        scrambleCount++;

        if (scrambleCount > 8) {
          clearInterval(scrambleInterval);

          currentIndex++;

          if (currentIndex <= finalText.length) {
            setTimeout(() => {
              revealNextLetter();
            }, 50);
          } else {
            setDisplayText(finalText);

            setFinished(true);

            setTimeout(() => {
              // setDisplayText("");

              startAnimation();
            }, 5000);
          }
        }
      }, 50);
    };

    const initialDelay = setTimeout(() => {
      startAnimation();
    }, 0);

    return () => {
      clearInterval(scrambleInterval);

      clearTimeout(initialDelay);
    };
  }, []);

  return {
    displayText,
    finished,
  };
}
