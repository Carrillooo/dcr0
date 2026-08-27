"use client";

import { useEffect, useRef } from "react";
import { useExperience } from "@/lib/store";

/* ---------------------------------------------------------------------------
 * Never autoplay. The toggle is small, permanent and honest, and the audio is
 * synthesised in the browser — no asset to load, nothing to 404, and it can be
 * replaced with real recordings later without touching this component.
 * ------------------------------------------------------------------------ */

export function SoundToggle({ inline = false }: { inline?: boolean }) {
  const on = useExperience((s) => s.sound);
  const toggle = useExperience((s) => s.toggleSound);
  const ctx = useRef<AudioContext | null>(null);
  const gain = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!on) {
      gain.current?.gain.setTargetAtTime(0, ctx.current?.currentTime ?? 0, 0.4);
      return;
    }

    if (!ctx.current) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audio = new AC();
      const master = audio.createGain();
      master.gain.value = 0;
      master.connect(audio.destination);

      // A distant engine: two detuned low oscillators through a lowpass, plus
      // filtered noise for road surface. Subtle enough to be atmosphere.
      const filter = audio.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 180;
      filter.Q.value = 0.7;
      filter.connect(master);

      [48, 72.5].forEach((f) => {
        const osc = audio.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = f;
        const g = audio.createGain();
        g.gain.value = 0.055;
        osc.connect(g).connect(filter);
        osc.start();
      });

      const buffer = audio.createBuffer(1, audio.sampleRate * 2, audio.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.14;
      const noise = audio.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const nf = audio.createBiquadFilter();
      nf.type = "bandpass";
      nf.frequency.value = 340;
      nf.Q.value = 0.5;
      const ng = audio.createGain();
      ng.gain.value = 0.05;
      noise.connect(nf).connect(ng).connect(master);
      noise.start();

      ctx.current = audio;
      gain.current = master;
    }

    ctx.current.resume();
    gain.current?.gain.setTargetAtTime(0.5, ctx.current.currentTime, 0.8);
  }, [on]);

  useEffect(() => () => { void ctx.current?.close(); }, []);

  const className = inline
    ? "flex items-center gap-2"
    : "fixed bottom-8 left-10 z-50 hidden items-center gap-2 md:flex";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      data-cursor={on ? "Mute" : "Sound"}
      className={className}
    >
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-[2px] bg-paper transition-all duration-500"
            style={{
              height: on ? `${5 + ((i * 7) % 9)}px` : "2px",
              animation: on ? `eq 1.${i}s ease-in-out infinite alternate` : "none",
            }}
          />
        ))}
      </span>
      <span className="t-mono text-aluminium transition-colors hover:text-paper">
        Sound {on ? "On" : "Off"}
      </span>
      <style>{`@keyframes eq{from{height:2px}to{height:11px}}`}</style>
    </button>
  );
}
