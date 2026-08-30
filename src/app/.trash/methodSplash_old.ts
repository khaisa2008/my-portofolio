"use client";

import { useEffect, useState } from "react";

export default function useMethod() {

    const bootstrap = "bootstrap/dist/js/bootstrap.bundle.min.js";

    useEffect(() => {

        import(bootstrap);

        // setTimeout(() => {
        //   // animasi zoom + fade semua item
        //   document
        //     .querySelector(".splash-content")
        //     ?.classList.add("zoom-out");

        //   // fade seluruh background splash
        //   setTimeout(() => {
        //     document
        //       .getElementById("intro")
        //       ?.classList.add("fade-out");

        //     // tampilkan halaman utama
        //     setTimeout(() => {
        //       const intro = document.getElementById("intro");
        //       const main = document.getElementById("main");

        //       if (intro) intro.style.display = "none";
        //       if (main) {
        //         main.style.display = "block";
        //         main.classList.add("main-show");
        //       }
        //     }, 800);
        //   }, 1000); // jeda 1 detik setelah item4 tampil
        // }, 4400);

    }, []);

    const setActive = (
        e: React.MouseEvent<HTMLElement>
    ) => {

        document
            .querySelector(".nav-link.active")
            ?.classList.remove("active");

        e.currentTarget.classList.add("active");
    };

    const enterPortfolio = () => {

        // disable spam click
        const btn =
            document.querySelector(
                ".enter-btn"
            ) as HTMLButtonElement | null;

        btn?.classList.add("clicked");

        if (btn) {
            btn.disabled = true;
        }

        // STEP 6
        document
            .querySelector(".splash-content")
            ?.classList.add("zoom-out");

        setTimeout(() => {

            document
                .getElementById("intro")
                ?.classList.add("fade-out");

            // STEP 7
            setTimeout(() => {

                const intro =
                    document.getElementById("intro");

                const main =
                    document.getElementById("main");

                if (intro) {
                    intro.style.display = "none";
                }

                if (main) {

                    main.style.display = "block";

                    main.classList.add("main-show");
                }

            }, 800);

        }, 1000);
    };

    const finalText = "MY PORTFOLIO";

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const [displayText, setDisplayText] =
        useState("");

    useEffect(() => {

        let currentIndex = 0;
        let scrambleInterval: NodeJS.Timeout;

        const revealNextLetter = () => {

            let scrambleCount = 0;

            scrambleInterval = setInterval(() => {

                const scrambled = finalText
                    .split("")
                    .map((char, index) => {

                        if (index < currentIndex) {
                            return finalText[index];
                        }

                        if (index === currentIndex) {

                            return chars[
                                Math.floor(
                                    Math.random() * chars.length
                                )
                            ];
                        }

                        return " ";
                    })
                    .join("");

                setDisplayText(scrambled);

                scrambleCount++;

                if (scrambleCount > 10) {

                    clearInterval(scrambleInterval);

                    currentIndex++;

                    setDisplayText(
                        finalText.slice(0, currentIndex)
                    );

                    if (currentIndex < finalText.length) {

                        setTimeout(() => {
                            revealNextLetter();
                        }, 80);
                    }
                }

            }, 60);
        };

        revealNextLetter();

        return () => {
            clearInterval(scrambleInterval);
        };

    }, []);

    return {
        displayText,
        setActive,
        enterPortfolio,
    };
}