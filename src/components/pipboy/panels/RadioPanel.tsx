"use client";

import { useState } from "react";

export function RadioPanel() {
  const [enabled, setEnabled] = useState(false);

  return (
    <section className="panel">
      <h2>Radio</h2>
      <p>Enable background ambience after user interaction.</p>
      <button className="pipButton" onClick={() => setEnabled((v) => !v)}>
        {enabled ? "Radio: ON" : "Radio: OFF"}
      </button>
      <p className="muted">
        Replace with royalty-free 1920s tracks in `public/assets/audio`.
      </p>
    </section>
  );
}
