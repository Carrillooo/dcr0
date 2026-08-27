"use client";

import * as THREE from "three";

/* ---------------------------------------------------------------------------
 * Procedural material maps. No external texture assets, so nothing to download
 * and nothing to go missing — and every map is generated at the resolution the
 * device tier can afford.
 * ------------------------------------------------------------------------ */

const cache = new Map<string, THREE.Texture>();

function make(key: string, size: number, draw: (c: CanvasRenderingContext2D, s: number) => void) {
  const hit = cache.get(key);
  if (hit) return hit;

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 4;
  cache.set(key, tex);
  return tex;
}

/** 2×2 twill carbon weave. Aligned, because misaligned weave is the tell. */
export function carbonMap(size = 256) {
  return make("carbon", size, (ctx, s) => {
    const cell = s / 8;
    ctx.fillStyle = "#0b0b0d";
    ctx.fillRect(0, 0, s, s);

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        // 2×2 twill: the float direction steps by one each row.
        const over = (Math.floor(x / 2) + Math.floor(y / 2)) % 2 === 0;
        const g = ctx.createLinearGradient(
          x * cell,
          y * cell,
          over ? (x + 1) * cell : x * cell,
          over ? y * cell : (y + 1) * cell,
        );
        g.addColorStop(0, "#141418");
        g.addColorStop(0.45, "#2a2a30");
        g.addColorStop(0.55, "#2a2a30");
        g.addColorStop(1, "#0d0d10");
        ctx.fillStyle = g;
        ctx.fillRect(x * cell, y * cell, cell, cell);

        ctx.strokeStyle = "rgba(0,0,0,0.55)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x * cell, y * cell, cell, cell);
      }
    }
  });
}

/** Brushed metal — fine directional streaks. Fakes anisotropy cheaply. */
export function brushedMap(size = 512) {
  return make("brushed", size, (ctx, s) => {
    ctx.fillStyle = "#8a8a86";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < s * 3; i++) {
      const y = Math.random() * s;
      const v = 128 + (Math.random() - 0.5) * 70;
      ctx.strokeStyle = `rgb(${v},${v},${v - 3})`;
      ctx.lineWidth = Math.random() * 1.4;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(s, y + (Math.random() - 0.5) * 3);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });
}

/** Micro-roughness variation. Constant roughness is what makes CG look plastic. */
export function microRoughnessMap(size = 256) {
  return make("micro", size, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = 150 + Math.random() * 60;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = n;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  });
}

/** Bead-blast texture for anodised faces. */
export function blastMap(size = 256) {
  return make("blast", size, (ctx, s) => {
    ctx.fillStyle = "#7d7d7a";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 9000; i++) {
      const v = 100 + Math.random() * 90;
      ctx.fillStyle = `rgba(${v},${v},${v},0.5)`;
      ctx.beginPath();
      ctx.arc(Math.random() * s, Math.random() * s, Math.random() * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

/** Soft contact shadow. A hard-edged circle reads as a sticker under the product. */
export function shadowMap(size = 256) {
  return make("shadow", size, (ctx, s) => {
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, s, s);
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(0,0,0,0.92)");
    g.addColorStop(0.35, "rgba(0,0,0,0.55)");
    g.addColorStop(0.68, "rgba(0,0,0,0.16)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

/** Vertical gradient. Used for the windscreen — a flat basic colour there reads
    as a sheet of cardboard behind the dashboard. */
export function gradientMap(top: string, bottom: string, key: string) {
  return make(`grad-${key}`, 128, (ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, 0, s);
    g.addColorStop(0, top);
    g.addColorStop(0.55, bottom);
    g.addColorStop(1, "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

export function disposeTextures() {
  cache.forEach((t) => t.dispose());
  cache.clear();
}
