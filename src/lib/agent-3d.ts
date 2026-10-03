// Builds a 3D Textcrew agent (Tex or a crew member) out of soft rounded shapes.
// Shared by the live hero scene and the still renders used elsewhere on the page.

import type { AgentId } from "./content";

type Three = typeof import("three");
type Mesh = import("three").Mesh;
type Group = import("three").Group;

const LOOKS: Record<AgentId, { base: number; shade: number; deep: number }> = {
  tex: { base: 0x3355f5, shade: 0x2440c4, deep: 0x1b2f94 },
  scout: { base: 0x11a39b, shade: 0x0c7f79, deep: 0x0a6b66 },
  byte: { base: 0x7b4dff, shade: 0x5f35d6, deep: 0x4a27b3 },
  patch: { base: 0xf5a623, shade: 0xd08612, deep: 0xb06f0a },
};

export const AGENT_ICONS: Record<AgentId, string[]> = {
  tex: ["..X..", "X.X.X", ".XXX.", "X.X.X", "..X.."],
  scout: ["XXX..", "X.X..", "XXX..", "...X.", "....X"],
  byte: ["X....", ".X...", "X....", ".....", "..XXX"],
  patch: [".....", "....X", "...X.", "X.X..", ".X..."],
};

// Tex wears one belt light per specialist: Byte, Patch, Scout.
const CREW_COLORS = [0x7b4dff, 0xf5a623, 0x11a39b];

export type AgentRig = {
  root: Group;
  body: Group;
  headPivot: Group;
  headNod: Group;
  eyeL: Mesh;
  eyeR: Mesh;
  mouth: Mesh;
  dots: Mesh[];
  caret?: Mesh;
  caretMaterial?: import("three").MeshStandardMaterial;
  dispose: () => void;
};

// A sphere pushed toward a box (superellipsoid), with exact normals so it shades smoothly.
export function softBlob(THREE: Three, w: number, h: number, d: number, p: number, seg: number) {
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

function pixelTexture(THREE: Three, draw: (ctx: CanvasRenderingContext2D, size: number) => void, size = 64) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export type BuildOptions = {
  // Working at a laptop: arms reach forward to the keyboard, eyes drop to the screen and hand props are put away.
  laptop?: boolean;
  // Where the eyes look along the screen (-1 left, 0 middle, 1 right); used for the typing flipbook.
  glance?: -1 | 0 | 1;
};

export function buildAgent(THREE: Three, who: AgentId, opts: BuildOptions = {}): AgentRig {
  const atLaptop = !!opts.laptop;
  const look = LOOKS[who];
  const trash: { dispose: () => void }[] = [];
  const keep = <T extends { dispose: () => void }>(x: T) => {
    trash.push(x);
    return x;
  };
  const std = (color: number, roughness: number, extra: Partial<import("three").MeshStandardMaterialParameters> = {}) =>
    keep(new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, ...extra }));
  const blob = (w: number, h: number, d: number, p: number, seg: number) => keep(softBlob(THREE, w, h, d, p, seg));

  const shellMat = std(look.base, 0.42);
  const suitMat = std(look.base, 0.6);
  const armMat = std(look.shade, 0.6);
  const legMat = std(0x2b2a26, 0.7);
  const screenMat = std(0x16151a, 0.22, { metalness: 0.1 });
  const darkMat = std(0x16151a, 0.5);
  const paperMat = std(0xf6f5f1, 0.55);
  const faceMat = keep(new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }));

  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  function part(geo: import("three").BufferGeometry, mat: import("three").Material, x: number, y: number, z: number, parent: import("three").Object3D = body) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  // Legs, torso, arms
  const legGeo = blob(0.19, 0.62, 0.19, 0.85, 40);
  part(legGeo, legMat, -0.13, 0.31, 0);
  part(legGeo, legMat, 0.13, 0.31, 0);
  if (who === "tex") {
    const cape = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.33, 0.5, 0.92, 48, 1, true, Math.PI / 2, Math.PI)), std(look.deep, 0.75, { side: THREE.DoubleSide }));
    cape.position.set(0, 0.93, -0.02);
    cape.castShadow = true;
    body.add(cape);
  }
  part(blob(0.64, 0.86, 0.46, 0.62, 64), suitMat, 0, 1.0, 0);
  const armGeo = blob(0.15, 0.64, 0.15, 0.85, 40);
  if (atLaptop) {
    // Pivot at the shoulder, swing forward and a little inward so the hands land on the keyboard
    for (const side of [-1, 1]) {
      const shoulder = new THREE.Group();
      shoulder.position.set(side * 0.41, 1.28, 0.02);
      shoulder.rotation.set(-0.66, 0, -side * 0.16);
      body.add(shoulder);
      part(armGeo, armMat, 0, -0.3, 0, shoulder);
    }
  } else {
    part(armGeo, armMat, -0.42, 0.98, 0).rotation.z = -0.12;
    part(armGeo, armMat, 0.42, 0.98, 0).rotation.z = 0.12;
  }

  // Chest badge with the agent's pixel icon
  const badgeTex = keep(
    pixelTexture(THREE, (ctx) => {
      ctx.fillStyle = "#16151A";
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = "#FFFFFF";
      AGENT_ICONS[who].forEach((row, j) => {
        for (let i = 0; i < 5; i++) if (row.charAt(i) === "X") ctx.fillRect(12 + i * 8, 12 + j * 8, 8, 8);
      });
    }),
  );
  const badge = new THREE.Mesh(keep(new THREE.PlaneGeometry(0.12, 0.12)), keep(new THREE.MeshBasicMaterial({ map: badgeTex, toneMapped: false })));
  badge.position.set(-0.14, 1.12, 0.236);
  body.add(badge);

  if (who === "tex") {
    part(blob(0.67, 0.08, 0.49, 0.5, 48), darkMat, 0, 0.66, 0);
    const pixelGeo = keep(new THREE.BoxGeometry(0.042, 0.042, 0.02));
    CREW_COLORS.forEach((hex, i) => {
      const px = new THREE.Mesh(pixelGeo, std(hex, 0.5, { emissive: hex, emissiveIntensity: 0.25 }));
      px.position.set((i - (CREW_COLORS.length - 1) / 2) * 0.1, 0.66, 0.25);
      body.add(px);
    });
  }

  // Head: coloured shell holding a dark glossy screen with pixel eyes
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.4, 0);
  body.add(headPivot);
  const headNod = new THREE.Group();
  headPivot.add(headNod);
  if (who === "byte") part(blob(1.2, 1.1, 0.96, 0.5, 64), armMat, 0, 0.46, -0.07, headNod);
  part(blob(1.06, 0.96, 0.86, 0.42, 96), shellMat, 0, 0.46, 0, headNod);
  if (who !== "byte") {
    const nubGeo = blob(0.09, 0.27, 0.22, 0.5, 32);
    part(nubGeo, armMat, -0.55, 0.5, 0, headNod);
    part(nubGeo, armMat, 0.55, 0.5, 0, headNod);
  }
  part(blob(0.8, 0.6, 0.14, 0.38, 64), screenMat, 0, 0.5, 0.39, headNod);

  const zFront = 0.466;
  const eyeGeo = keep(new THREE.PlaneGeometry(0.12, 0.12));
  const eyeY = atLaptop ? 0.48 : 0.52;
  const eyeX = (opts.glance ?? 0) * 0.03;
  const eyeL = new THREE.Mesh(eyeGeo, faceMat);
  eyeL.position.set(-0.16 + eyeX, eyeY, zFront);
  const eyeR = new THREE.Mesh(eyeGeo, faceMat);
  eyeR.position.set(0.16 + eyeX, eyeY, zFront);
  if (atLaptop) {
    // Focused: a slightly flatter look down at the screen
    eyeL.scale.y = 0.78;
    eyeR.scale.y = 0.78;
  }
  const mouth = new THREE.Mesh(keep(new THREE.PlaneGeometry(0.09, 0.02)), faceMat);
  mouth.position.set(0.01, 0.33, zFront);
  headNod.add(eyeL, eyeR, mouth);
  const dotGeo = keep(new THREE.PlaneGeometry(0.075, 0.075));
  const dots = [-0.15, 0, 0.15].map((x) => {
    const m = new THREE.Mesh(dotGeo, faceMat);
    m.position.set(x, 0.52, zFront);
    m.visible = false;
    headNod.add(m);
    return m;
  });

  // The right hand holds each specialist's prop
  const hand = new THREE.Group();
  hand.position.set(0.46, 0.67, 0.02);
  body.add(hand);

  if (who === "scout" && !atLaptop) {
    const handle = part(keep(new THREE.CylinderGeometry(0.02, 0.02, 0.24, 12)), darkMat, 0.06, 0.1, 0.04, hand);
    handle.rotation.z = -0.55;
    part(keep(new THREE.TorusGeometry(0.095, 0.024, 12, 40)), darkMat, 0.16, 0.26, 0.05, hand);
    part(keep(new THREE.CircleGeometry(0.09, 32)), std(0xbfeee9, 0.1, { transparent: true, opacity: 0.55 }), 0.16, 0.26, 0.05, hand);
  }
  if (who === "patch") {
    const glassMat = std(look.base, 0.4);
    const ring = keep(new THREE.TorusGeometry(0.1, 0.014, 10, 40));
    part(ring, glassMat, -0.16, 0.52, zFront + 0.012, headNod);
    part(ring, glassMat, 0.16, 0.52, zFront + 0.012, headNod);
    part(keep(new THREE.BoxGeometry(0.1, 0.018, 0.018)), glassMat, 0, 0.53, zFront + 0.012, headNod);
  }
  if (who === "patch" && !atLaptop) {
    const boardTex = keep(
      pixelTexture(THREE, (ctx) => {
        ctx.fillStyle = "#F6F5F1";
        ctx.fillRect(0, 0, 64, 64);
        ctx.fillStyle = "#22A45D";
        [18, 34].forEach((y) => {
          ctx.fillRect(10, y, 4, 4);
          ctx.fillRect(14, y + 4, 4, 4);
          ctx.fillRect(18, y, 4, 4);
          ctx.fillRect(22, y - 4, 4, 4);
        });
        ctx.fillStyle = "#C9C5BA";
        [18, 34, 50].forEach((y) => ctx.fillRect(32, y, 22, 4));
        ctx.fillStyle = "#E5533D";
        ctx.fillRect(12, 48, 8, 8);
      }),
    );
    const board = new THREE.Group();
    board.position.set(0.12, 0.14, 0.09);
    board.rotation.z = -0.12;
    hand.add(board);
    part(keep(new THREE.BoxGeometry(0.21, 0.27, 0.025)), paperMat, 0, 0, 0, board);
    part(keep(new THREE.PlaneGeometry(0.19, 0.23)), keep(new THREE.MeshBasicMaterial({ map: boardTex })), 0, -0.01, 0.0135, board);
    part(keep(new THREE.BoxGeometry(0.08, 0.035, 0.035)), darkMat, 0, 0.13, 0.01, board);
  }
  if (who === "byte") {
    const stringGeo = keep(new THREE.CylinderGeometry(0.008, 0.008, 0.2, 8));
    part(stringGeo, paperMat, -0.05, 1.22, 0.232);
    part(stringGeo, paperMat, 0.05, 1.22, 0.232);
  }

  // A light laptop held at the waist, lid towards the viewer with the agent's icon on the back
  if (atLaptop) {
    const laptop = new THREE.Group();
    laptop.position.set(0, 0.76, 0.52);
    body.add(laptop);
    const shell = std(0xf3f2ee, 0.3, { metalness: 0.1 });
    part(blob(0.92, 0.045, 0.5, 0.22, 48), shell, 0, 0, 0, laptop);
    part(keep(new THREE.PlaneGeometry(0.8, 0.3)), std(0x2b2a26, 0.6), 0, 0.024, -0.05, laptop).rotation.x = -Math.PI / 2;
    const lid = new THREE.Group();
    lid.position.set(0, 0.022, 0.24);
    lid.rotation.x = 0.2;
    laptop.add(lid);
    part(blob(0.92, 0.5, 0.028, 0.22, 48), shell, 0, 0.25, 0, lid);
    // Inner screen, facing the agent, lit so a little glow shows at the edges
    const glow = keep(new THREE.MeshBasicMaterial({ color: 0xbfd0ff, toneMapped: false }));
    const screen = new THREE.Mesh(keep(new THREE.PlaneGeometry(0.82, 0.42)), glow);
    screen.position.set(0, 0.26, -0.0155);
    screen.rotation.y = Math.PI;
    lid.add(screen);
    const hex = `#${look.base.toString(16).padStart(6, "0")}`;
    const logoTex = keep(
      pixelTexture(THREE, (ctx) => {
        ctx.clearRect(0, 0, 64, 64);
        ctx.fillStyle = hex;
        AGENT_ICONS[who].forEach((row, j) => {
          for (let i = 0; i < 5; i++) if (row.charAt(i) === "X") ctx.fillRect(12 + i * 8, 12 + j * 8, 8, 8);
        });
      }),
    );
    const logo = new THREE.Mesh(keep(new THREE.PlaneGeometry(0.14, 0.14)), keep(new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, toneMapped: false })));
    logo.position.set(0, 0.26, 0.0155);
    lid.add(logo);
  }

  let caret: Mesh | undefined;
  let caretMaterial: import("three").MeshStandardMaterial | undefined;
  if (who === "tex") {
    caretMaterial = std(look.base, 0.4, { emissive: look.base, emissiveIntensity: 0.6 });
    caret = new THREE.Mesh(keep(new THREE.BoxGeometry(0.075, 0.36, 0.075)), caretMaterial);
    caret.position.set(0.9, 1.95, 0.05);
    caret.castShadow = true;
    root.add(caret);
  }

  return {
    root,
    body,
    headPivot,
    headNod,
    eyeL,
    eyeR,
    mouth,
    dots,
    caret,
    caretMaterial,
    dispose: () => trash.forEach((x) => x.dispose()),
  };
}

// Studio lighting shared by every 3D view. Intensities are scaled by PI for three's physically based lights.
export function addStudioLights(THREE: Three, scene: import("three").Scene) {
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
  return { hemi, groundMat };
}
