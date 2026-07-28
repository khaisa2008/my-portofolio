"use client";

import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";

const NAME = "M Khairul Unsa";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function useHeaderText() {
  const { lang } = useLanguage();

  // Teks target bahasa saat ini (dinamis)
  const prefixTarget = lang === "ID" ? "Halo, Saya " : "Hi, I'm ";

  // State untuk menyimpan progress pengetikan (berupa string sementara dari animasi)
  const [rawPrefix, setRawPrefix] = useState(prefixTarget);
  const [nameText, setNameText] = useState(NAME);
  const [blink, setBlink] = useState(false);

  // Menyimpan referensi prefixTarget terbaru agar fungsi interval animasi selalu mendapat nilai paling update
  const prefixTargetRef = useRef(prefixTarget);
  useEffect(() => {
    prefixTargetRef.current = prefixTarget;
  }, [prefixTarget]);

  useEffect(() => {
    let mounted = true;
    let timer: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    const scrambleLetter = (
      getTarget: () => string,
      setter: (value: string) => void,
      startIndex: number,
      done: () => void
    ) => {
      let index = startIndex;

      const reveal = () => {
        let scramble = 0;

        interval = setInterval(() => {
          const currentTarget = getTarget();
          const text = currentTarget
            .split("")
            .map((char, i) => {
              if (i < index) return currentTarget[i];
              if (i === index)
                return CHARS[Math.floor(Math.random() * CHARS.length)];
              return "";
            })
            .join("");

          setter(text);
          scramble++;

          if (scramble > 3) {
            clearInterval(interval);
            index++;

            if (index <= currentTarget.length) {
              timer = setTimeout(reveal, 50);
            } else {
              setter(currentTarget);
              done();
            }
          }
        }, 50);
      };

      reveal();
    };

    const typeForward = () => {
      scrambleLetter(
        () => prefixTargetRef.current,
        setRawPrefix,
        0,
        () => {
          scrambleLetter(() => NAME, setNameText, 0, () => {
            setBlink(true);

            timer = setTimeout(() => {
              setBlink(false);
              eraseBackward();
            }, 4000);
          });
        }
      );
    };

    const eraseBackward = () => {
      let currentPrefix = prefixTargetRef.current;
      let full = currentPrefix + NAME;
      let currentLength = full.length;

      const eraseNext = () => {
        let scramble = 0;

        interval = setInterval(() => {
          currentPrefix = prefixTargetRef.current;
          full = currentPrefix + NAME;

          const text = full
            .split("")
            .map((char, index) => {
              if (index < currentLength - 1) return full[index];
              if (index === currentLength - 1)
                return CHARS[Math.floor(Math.random() * CHARS.length)];
              return "";
            })
            .join("");

          if (text.length <= currentPrefix.length) {
            setRawPrefix(text);
            setNameText("");
          } else {
            setRawPrefix(currentPrefix);
            setNameText(text.slice(currentPrefix.length));
          }

          scramble++;

          if (scramble > 3) {
            clearInterval(interval);
            currentLength--;

            const real = full.slice(0, currentLength);

            if (real.length <= currentPrefix.length) {
              setRawPrefix(real);
              setNameText("");
            } else {
              setRawPrefix(currentPrefix);
              setNameText(real.slice(currentPrefix.length));
            }

            if (currentLength > 0) {
              timer = setTimeout(eraseNext, 50);
            } else {
              setRawPrefix("");
              setNameText("");

              timer = setTimeout(() => {
                if (mounted) typeForward();
              }, 1000);
            }
          }
        }, 50);
      };

      eraseNext();
    };

    timer = setTimeout(() => {
      eraseBackward();
    }, 2000);

    return () => {
      mounted = false;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []); // Cukup di-run sekali saat mount, animasi tidak perlu di-reset dari awal saat lang berubah

  // Jika animasi sudah selesai menayangkan prefix secara penuh, tampilkan prefixTarget bahasa yang aktif secara realtime.
  // Jika sedang berjalan animasinya (misal sedang mengetik/menghapus), tampilkan teks animasi rawPrefix.
  const isPrefixFullyTyped =
    rawPrefix === "Halo, Saya " || rawPrefix === "Hi, I'm ";

  const prefixText = isPrefixFullyTyped ? prefixTarget : rawPrefix;

  return {
    prefixText,
    nameText,
    blink,
  };
}