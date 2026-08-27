"use client";

import { useEffect } from "react";
import { useExperience, type SceneKey, type CanvasFinish, type CanvasMood } from "@/lib/store";

/**
 * Declares what the persistent canvas should be showing for this route, and
 * restores a quiet state on unmount. Routes never mount their own Canvas.
 */
export function Scene({
  scene,
  finish = "graphite",
  mood = "soft",
  glow = 1,
  offsetX = 0,
}: {
  scene: SceneKey;
  finish?: CanvasFinish;
  mood?: CanvasMood;
  glow?: number;
  offsetX?: number;
}) {
  const setScene = useExperience((s) => s.setScene);
  const setStage = useExperience((s) => s.setStage);
  const setDressing = useExperience((s) => s.setDressing);

  useEffect(() => {
    setScene(scene);
    setDressing({ finish, mood, glow, offsetX });
    if (scene === "product") setStage("studio", 1);
    else if (scene === "vehicle") setStage("idle", 0);
    return () => {
      setScene("void");
    };
  }, [scene, finish, mood, glow, offsetX, setScene, setStage, setDressing]);

  return null;
}
