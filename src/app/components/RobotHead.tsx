"use client";

import { useEffect, useRef, useState } from "react";
import useRobotHead from "../function/UseRobotHead";

export default function RobotHead() {

  const {

    eyeLeft,
    eyeRight,
    headRef,

    blinkLeft,
    blinkRight,

    angry,
    dizzy,

    handleLeftEyeClick,
    handleRightEyeClick,
    handleHeadClick,

  } = useRobotHead();

  return (

    <div className="robot-wrapper">
      <div className={`robot-fall ${dizzy ? "robot-fall-active" : ""}`}>

      <div
        ref={headRef}
        className={`
          robot-head
          ${angry ? "angry-head robot-angry" : ""}
          ${dizzy ? "robot-dizzy" : ""}
        `}
        onClick={handleHeadClick}
      >

        {/* ================= ANTENNA ================= */}

        <div className="antenna">

          <div
            className={`
              antenna-ball
              ${angry ? "antenna-angry" : ""}
            `}
          />

        </div>
        {
          dizzy && (
            <div className="dizzy-ring"></div>
          )
        }
        {/* ================= EARS ================= */}

        <div
          className={`
            ear left-ear
            ${angry ? "ear-angry" : ""}
          `}
        >

          <div
            className={`
              ear-light
              ${angry ? "ear-light-angry" : ""}
            `}
          />

        </div>

        <div
          className={`
            ear right-ear
            ${angry ? "ear-angry" : ""}
          `}
        >

          <div
            className={`
              ear-light
              ${angry ? "ear-light-angry" : ""}
            `}
          />

        </div>

        {/* ================= FACE ================= */}

        <div className="face-screen">

          <div className="eye-container">

            {/* ================= LEFT EYE ================= */}

            <div
              ref={eyeLeft}
              onClick={handleLeftEyeClick}
              className={`
                eye
                ${blinkLeft ? "eye-blink" : ""}
                ${angry ? "angry-eye left-angry" : ""}
                ${dizzy ? "dizzy-eye" : ""}
              `}
            ></div>

            {/* ================= RIGHT EYE ================= */}

            <div
              ref={eyeRight}
              onClick={handleRightEyeClick}
              className={`
                eye
                ${blinkRight ? "eye-blink" : ""}
                ${angry ? "angry-eye right-angry" : ""}
                ${dizzy ? "dizzy-eye" : ""}
              `}
            ></div>

          </div>

        </div>

      </div>
      </div>

    </div>
  );
}