"use client";

import { useEffect, useRef, useState } from "react";
import { AgentFigure } from "./agent";

export type StageMode = "idle" | "typing" | "done";

type Three = typeof import("three");
type Builders = typeof import("@/lib/agent-3d");
type ModeRef = { current: { mode: StageMode; since: number } };

// The live, animated 3D Tex in the hero. Everything else on the page uses still renders (Agent3D).
export function Tex3D({ mode, onActivate }: { mode: StageMode; onActivate: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<{ mode: StageMode; since: number }>({ mode: "idle", since: 0 });
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    modeRef.current = { mode, since: performance.now() };
  }, [mode]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    let disposed = false;
    let teardown: (() => void) | undefined;
    Promise.all([import("three"), import("@/lib/agent-3d")])
      .then(([THREE, builders]) => {
        if (disposed) return;
        try {
          teardown = mountScene(THREE, builders, wrap, canvas, modeRef, () => {
            if (!disposed) setStatus("ready");
          });
        } catch {
          setStatus("failed");
        }
      })
      .catch(() => {
        if (!disposed) setStatus("failed");
      });
    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  const fallbackMood = mode === "typing" ? "working" : mode === "done" ? "done" : "auto";

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        onClick={onActivate}
        aria-hidden="true"
        className={`block h-full w-full cursor-pointer transition-opacity duration-700 ${status === "ready" ? "opacity-100" : "opacity-0"}`}
      />
      {status !== "ready" && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center">
          <AgentFigure who="tex" mood={fallbackMood} size={300} className="h-[96%] w-auto" />
        </div>
      )}
    </div>
  );
}

function mountScene(THREE: Three, builders: Builders, wrap: HTMLDivElement, canvas: HTMLCanvasElement, modeRef: ModeRef, onReady: () => void) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scene = new THREE.Scene();
  builders.addStudioLights(THREE, scene);
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  const target = new THREE.Vector3(0.12, 1.2, 0);

  const rig = builders.buildAgent(THREE, "tex");
  rig.root.position.x = 0.22;
  scene.add(rig.root);
  const { body, headPivot, headNod, eyeL, eyeR, mouth, dots, caret } = rig;

  const pointer = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    const r = wrap.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  function resize() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.set(0.12, 1.5, w / h < 0.95 ? 7.2 : 6.4);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(wrap);
  resize();

  const clamp = THREE.MathUtils.clamp;
  const start = performance.now();
  let nextBlink = 2.5;
  let raf = 0;
  let visible = true;
  let readySent = false;

  function frame(now: number) {
    const t = (now - start) / 1000;
    const { mode, since } = modeRef.current;
    const k = (now - since) / 1000;

    body.position.y = reduce ? 0 : Math.sin(t * 1.7) * 0.012;

    let yaw = clamp(pointer.x, -1.4, 1.4) * 0.42;
    let pitch = clamp(pointer.y, -1.2, 1.2) * 0.18;
    if (mode === "typing") {
      pitch = 0.14;
      yaw *= 0.3;
    }
    headPivot.rotation.y += (yaw - headPivot.rotation.y) * 0.08;
    headPivot.rotation.x += (pitch - headPivot.rotation.x) * 0.08;
    body.rotation.y += (yaw * 0.22 - body.rotation.y) * 0.05;

    let eyesOn = true;
    let dotsOn = false;
    let eyeScale = 1;
    let eyeY = 0.52;
    let nod = 0;
    if (mode === "typing") {
      eyesOn = false;
      dotsOn = true;
      dots.forEach((d, i) => {
        d.position.y = 0.52 + (reduce ? 0 : Math.max(0, Math.sin(k * 7 - i * 0.8)) * 0.05);
      });
    } else if (mode === "done") {
      eyeScale = 0.35;
      eyeY = 0.55;
      if (k < 0.9 && !reduce) nod = Math.sin((k / 0.9) * Math.PI * 2) * 0.1;
    } else if (!reduce && t > nextBlink) {
      if (t < nextBlink + 0.14) eyeScale = 0.12;
      else nextBlink = t + 2.5 + Math.random() * 2.5;
    }
    headNod.rotation.x = nod;
    eyeL.visible = eyeR.visible = mouth.visible = eyesOn;
    dots.forEach((d) => (d.visible = dotsOn));
    eyeL.scale.y = eyeR.scale.y = eyeScale;
    eyeL.position.y = eyeR.position.y = eyeY;

    if (caret) {
      const period = mode === "typing" ? 0.25 : 0.53;
      caret.visible = reduce || mode === "done" ? true : Math.floor(t / period) % 2 === 0;
      caret.position.y = 1.95 + (reduce ? 0 : Math.sin(t * 1.3) * 0.03);
    }

    renderer.render(scene, camera);
    if (!readySent) {
      readySent = true;
      onReady();
    }
    raf = visible ? requestAnimationFrame(frame) : 0;
  }

  // Browsers drop WebGL frames for hidden tabs, so draw straight away when the tab or stage comes back.
  function setVisible(next: boolean) {
    visible = next;
    if (visible && !raf) frame(performance.now());
  }
  const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && !document.hidden));
  io.observe(wrap);
  const onVisibility = () => setVisible(!document.hidden);
  document.addEventListener("visibilitychange", onVisibility);
  frame(performance.now());

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pointermove", onPointer);
    rig.dispose();
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m) => m.dispose());
      }
    });
    renderer.dispose();
  };
}
