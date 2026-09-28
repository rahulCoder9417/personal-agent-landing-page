"use client";

import { useEffect, useRef, useState } from "react";
import { AgentFigure } from "./agent";

export type StageMode = "idle" | "typing" | "done";

type Three = typeof import("three");
type ModeRef = { current: { mode: StageMode; since: number } };

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
    import("three")
      .then((THREE) => {
        if (disposed) return;
        try {
          teardown = mountScene(THREE, wrap, canvas, modeRef, () => {
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

function mountScene(THREE: Three, wrap: HTMLDivElement, canvas: HTMLCanvasElement, modeRef: ModeRef, onReady: () => void) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  const target = new THREE.Vector3(0.12, 1.2, 0);

  // Intensities are scaled by PI: three's physically based lights are PI times dimmer than the old default.
  const PI = Math.PI;
  const hemi = new THREE.HemisphereLight(0xffffff, 0xb9b3a4, 0.55 * PI);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff6ea, 2.6 * PI);
  key.position.set(-1.4, 6.5, 3.2);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 4, bottom: -1, near: 1, far: 16 });
  key.shadow.radius = 8;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 1.6 * PI);
  rim.position.set(3.5, 3.6, -4);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xe6ecff, 0.5 * PI);
  fill.position.set(4, 1.5, 3);
  scene.add(fill);

  const groundMat = new THREE.ShadowMaterial({ opacity: 0.2 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // A sphere pushed toward a box (superellipsoid), with exact normals so it shades smoothly.
  function blob(w: number, h: number, d: number, p: number, seg: number) {
    const g = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.75));
    const pos = g.attributes.position;
    const nor = g.attributes.normal;
    const v = new THREE.Vector3();
    const n = new THREE.Vector3();
    const a = w / 2;
    const b = h / 2;
    const c = d / 2;
    const e = 2 / p;
    const f = (x: number) => Math.sign(x) * Math.pow(Math.abs(x), p);
    const gr = (x: number, s: number) => (Math.sign(x) * Math.pow(Math.abs(x / s), e - 1)) / s;
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const x = f(v.x) * a;
      const y = f(v.y) * b;
      const z = f(v.z) * c;
      pos.setXYZ(i, x, y, z);
      n.set(gr(x, a), gr(y, b), gr(z, c));
      if (n.lengthSq() < 1e-12) n.copy(v);
      n.normalize();
      nor.setXYZ(i, n.x, n.y, n.z);
    }
    pos.needsUpdate = true;
    nor.needsUpdate = true;
    g.computeBoundingSphere();
    return g;
  }

  const std = (color: number, roughness: number, extra: Partial<import("three").MeshStandardMaterialParameters> = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, ...extra });
  const shellMat = std(0x3355f5, 0.42);
  const suitMat = std(0x3355f5, 0.6);
  const armMat = std(0x2440c4, 0.6);
  const legMat = std(0x2b2a26, 0.7);
  const capeMat = std(0x1b2f94, 0.75, { side: THREE.DoubleSide });
  const screenMat = std(0x16151a, 0.22, { metalness: 0.1 });
  const beltMat = std(0x16151a, 0.5);
  const faceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const caretMat = std(0x3355f5, 0.4, { emissive: 0x3355f5, emissiveIntensity: 0.6 });

  const tex = new THREE.Group();
  tex.position.x = 0.22;
  scene.add(tex);
  const body = new THREE.Group();
  tex.add(body);

  function part(geo: import("three").BufferGeometry, mat: import("three").Material, x: number, y: number, z: number, parent: import("three").Object3D = body) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  const legGeo = blob(0.19, 0.62, 0.19, 0.85, 40);
  part(legGeo, legMat, -0.13, 0.31, 0);
  part(legGeo, legMat, 0.13, 0.31, 0);
  const cape = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.5, 0.92, 48, 1, true, Math.PI / 2, Math.PI), capeMat);
  cape.position.set(0, 0.93, -0.02);
  cape.castShadow = true;
  body.add(cape);
  part(blob(0.64, 0.86, 0.46, 0.62, 64), suitMat, 0, 1.0, 0);
  part(blob(0.67, 0.08, 0.49, 0.5, 48), beltMat, 0, 0.66, 0);
  const pixelGeo = new THREE.BoxGeometry(0.042, 0.042, 0.02);
  [0x11a39b, 0x7b4dff, 0xf5a623, 0xe93d82, 0x22a45d, 0xff6b2c].forEach((hex, i) => {
    const px = new THREE.Mesh(pixelGeo, std(hex, 0.5, { emissive: hex, emissiveIntensity: 0.25 }));
    px.position.set(-0.15 + i * 0.06, 0.66, 0.25);
    body.add(px);
  });

  const badgeCanvas = document.createElement("canvas");
  badgeCanvas.width = 64;
  badgeCanvas.height = 64;
  const bctx = badgeCanvas.getContext("2d");
  if (bctx) {
    bctx.fillStyle = "#16151A";
    bctx.fillRect(0, 0, 64, 64);
    bctx.fillStyle = "#FFFFFF";
    ["..X..", "X.X.X", ".XXX.", "X.X.X", "..X.."].forEach((row, j) => {
      for (let i = 0; i < 5; i++) if (row.charAt(i) === "X") bctx.fillRect(12 + i * 8, 12 + j * 8, 8, 8);
    });
  }
  const badgeTex = new THREE.CanvasTexture(badgeCanvas);
  badgeTex.magFilter = THREE.NearestFilter;
  badgeTex.colorSpace = THREE.SRGBColorSpace;
  const badge = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.12), new THREE.MeshBasicMaterial({ map: badgeTex, toneMapped: false }));
  badge.position.set(-0.14, 1.12, 0.236);
  body.add(badge);

  const armGeo = blob(0.15, 0.64, 0.15, 0.85, 40);
  part(armGeo, armMat, -0.42, 0.98, 0).rotation.z = -0.12;
  part(armGeo, armMat, 0.42, 0.98, 0).rotation.z = 0.12;

  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.4, 0);
  body.add(headPivot);
  const headNod = new THREE.Group();
  headPivot.add(headNod);
  part(blob(1.06, 0.96, 0.86, 0.42, 96), shellMat, 0, 0.46, 0, headNod);
  const nubGeo = blob(0.09, 0.27, 0.22, 0.5, 32);
  part(nubGeo, armMat, -0.55, 0.5, 0, headNod);
  part(nubGeo, armMat, 0.55, 0.5, 0, headNod);
  part(blob(0.8, 0.6, 0.14, 0.38, 64), screenMat, 0, 0.5, 0.39, headNod);

  const zFront = 0.466;
  const eyeGeo = new THREE.PlaneGeometry(0.12, 0.12);
  const eyeL = new THREE.Mesh(eyeGeo, faceMat);
  eyeL.position.set(-0.16, 0.52, zFront);
  const eyeR = new THREE.Mesh(eyeGeo, faceMat);
  eyeR.position.set(0.16, 0.52, zFront);
  const mouth = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.02), faceMat);
  mouth.position.set(0.01, 0.33, zFront);
  headNod.add(eyeL, eyeR, mouth);
  const dotGeo = new THREE.PlaneGeometry(0.075, 0.075);
  const dots = [-0.15, 0, 0.15].map((x) => {
    const m = new THREE.Mesh(dotGeo, faceMat);
    m.position.set(x, 0.52, zFront);
    m.visible = false;
    headNod.add(m);
    return m;
  });

  const caret = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.36, 0.075), caretMat);
  caret.position.set(0.9, 1.95, 0.05);
  caret.castShadow = true;
  tex.add(caret);

  function applyTheme() {
    const dark = darkQuery.matches;
    const accent = dark ? 0x6b86ff : 0x3355f5;
    caretMat.color.setHex(accent);
    caretMat.emissive.setHex(accent);
    groundMat.opacity = dark ? 0.45 : 0.2;
    hemi.intensity = (dark ? 0.45 : 0.55) * PI;
  }
  applyTheme();
  darkQuery.addEventListener("change", applyTheme);

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

    const period = mode === "typing" ? 0.25 : 0.53;
    caret.visible = reduce || mode === "done" ? true : Math.floor(t / period) % 2 === 0;
    caret.position.y = 1.95 + (reduce ? 0 : Math.sin(t * 1.3) * 0.03);

    renderer.render(scene, camera);
    if (!readySent) {
      readySent = true;
      onReady();
    }
    raf = visible ? requestAnimationFrame(frame) : 0;
  }

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
    darkQuery.removeEventListener("change", applyTheme);
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => m.dispose());
      }
    });
    badgeTex.dispose();
    renderer.dispose();
  };
}
