"use client";

import { useLayoutEffect, useRef } from "react";
import useMethodNav from "@/app/functions/UseNav";

const NAV_ITEMS = [
  { id: "home", icon: "bi-house", label: "Home" },
  { id: "about", icon: "bi-person", label: "About" },
  { id: "skills", icon: "bi-code-slash", label: "Skills" },
  { id: "projects", icon: "bi-briefcase", label: "Projects" },
  { id: "contact", icon: "bi-envelope", label: "Contact" },
] as const;

export default function Navbar() {
  const { active, handleClick } = useMethodNav();
  const navRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // offsetHeight = tinggi LAYOUT, tidak terpengaruh transform scale
    // dari UseZoomLock. #main memakainya lewat calc(--nav-h / --zoom),
    // jadi padding selalu pas dengan navbar yang di-scale 1/z.
    const sync = () => {
      document.documentElement.style.setProperty(
        "--nav-h",
        `${Math.round(nav.offsetHeight)}px`,
      );
    };

    sync();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", sync);
      return () => window.removeEventListener("resize", sync);
    }

    const ro = new ResizeObserver(sync);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  return (
    <nav ref={navRef} className="navbar pt-3 navbar-fixed">
      <div className="container justify-content-center">
        <div className="rounded-pill shadow-sm px-2 px-md-4 py-1 py-md-2 nav-capsule">
          <ul className="d-flex flex-row align-items-center gap-1 gap-md-3 fw-semibold mb-0 p-0 list-unstyled">
            {NAV_ITEMS.map(({ id, icon, label }) => {
              const isActive = active === id;
              return (
                <li className="nav-item" key={id}>
                  <a
                    href={`#${id}`}
                    className={`nav-link ${isActive ? "active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(id);
                    }}
                  >
                    <i className={`bi ${icon}`} aria-hidden="true"></i>
                    <span> {label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
