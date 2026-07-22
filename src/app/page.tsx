"use client";

import { useState } from "react";

import SplashScreen from "./page/SplashScreen";
import MainPortfolio from "./page/MainPortfolio";

export default function Home() {
  const [showMain, setShowMain] = useState(false);

  return (
    <>
      <MainPortfolio />;
      {/* {!showMain && <SplashScreen setShowMain={setShowMain} />}
      
      {showMain && <MainPortfolio />} */}
    </>
  );
}
