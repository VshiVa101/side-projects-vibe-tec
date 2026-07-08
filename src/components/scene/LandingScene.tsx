"use client";

import { useEffect, useMemo, useState } from "react";
import { PipTabs } from "@/components/pipboy/PipTabs";

export function LandingScene() {
  const [started, setStarted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!started) return;
    const timer = window.setTimeout(() => setIntroDone(true), 3200);
    return () => window.clearTimeout(timer);
  }, [started]);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 8;
      const y = (event.clientY / window.innerHeight - 0.5) * 8;
      setParallax({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const armStyle = useMemo(
    () => ({
      transform: `translate(${parallax.x}px, ${parallax.y}px) ${
        started && !introDone ? "translateY(10%)" : "translateY(0)"
      }`,
      transition: started && !introDone ? "transform 3.2s ease-out" : "transform 0.2s linear"
    }),
    [introDone, parallax, started]
  );

  return (
    <main className="sceneRoot">
      <video className="bgVideo" autoPlay loop muted playsInline>
        <source src="/assets/video/bg-loop.mp4" type="video/mp4" />
      </video>

      <div className={`introOverlay ${started ? "hidden" : ""}`}>
        <h1>PIP-FOLIO</h1>
        <p>Post-apocalyptic calm meets UX storytelling.</p>
        <button className="pipButton" onClick={() => setStarted(true)}>
          ENTER
        </button>
        <button
          className="pipButton ghost"
          onClick={() => {
            setStarted(true);
            setIntroDone(true);
          }}
        >
          SKIP
        </button>
      </div>

      <div className="armLayer" style={armStyle}>
        <img
          src="/assets/images/pipboy-arm.png"
          alt="Pip-Boy arm overlay"
          className="armImage"
        />
      </div>

      <section className={`screenViewport ${started ? "active" : ""}`}>
        {(introDone || !started) && <PipTabs />}
      </section>
    </main>
  );
}
