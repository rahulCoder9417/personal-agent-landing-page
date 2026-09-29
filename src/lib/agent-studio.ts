// Renders 3D agents to still images in the browser, one WebGL context for the whole page.
// Each agent is drawn once and cached; the context is released a few seconds after the last render,
// so the page can show many 3D agents without keeping many GPU contexts alive.

import type { AgentId } from "./content";

// "work-a" and "work-b" are two frames of an agent typing at a laptop, looking along the screen.
export type Pose = "front" | "left" | "right" | "work-a" | "work-b";

type Studio = { render: (who: AgentId, pose: Pose) => string; dispose: () => void };

const SIZE = 640;
const cache = new Map<string, string>();
const pending = new Map<string, Promise<string>>();
let studio: Promise<Studio> | null = null;
let releaseTimer: ReturnType<typeof setTimeout> | undefined;

async function createStudio(): Promise<Studio> {
  const THREE = await import("three");
  const { buildAgent, addStudioLights } = await import("./agent-3d");

  const canvas = document.createElement("canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(SIZE, SIZE, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  addStudioLights(THREE, scene);
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
  camera.position.set(0, 1.3, 6.9);
  camera.lookAt(0, 1.12, 0);

  return {
    render(who, pose) {
      const working = pose === "work-a" || pose === "work-b";
      const rig = buildAgent(THREE, who, working ? { laptop: true, glance: pose === "work-a" ? -1 : 1 } : {});
      if (working) {
        // Straight-on view, head bowed to the screen
        rig.root.rotation.y = 0;
        rig.headPivot.rotation.y = pose === "work-a" ? 0.04 : -0.04;
        rig.headPivot.rotation.x = 0.16;
      } else {
        rig.root.rotation.y = pose === "left" ? 0.38 : pose === "right" ? -0.38 : -0.14;
        rig.headPivot.rotation.y = pose === "left" ? 0.12 : pose === "right" ? -0.12 : 0.08;
        rig.headPivot.rotation.x = 0.04;
      }
      scene.add(rig.root);
      renderer.render(scene, camera);
      const url = canvas.toDataURL("image/png");
      scene.remove(rig.root);
      rig.dispose();
      return url;
    },
    dispose() {
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}

function scheduleRelease() {
  clearTimeout(releaseTimer);
  releaseTimer = setTimeout(() => {
    if (pending.size > 0 || !studio) return;
    const current = studio;
    studio = null;
    current.then((s) => s.dispose()).catch(() => {});
  }, 4000);
}

const nextTick = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

export function renderAgent(who: AgentId, pose: Pose = "front"): Promise<string> {
  const key = `${who}:${pose}`;
  const hit = cache.get(key);
  if (hit) return Promise.resolve(hit);
  const inFlight = pending.get(key);
  if (inFlight) return inFlight;

  studio ??= createStudio();
  const job = studio
    .then(async (s) => {
      await nextTick(); // let the page breathe between renders
      const url = s.render(who, pose);
      cache.set(key, url);
      return url;
    })
    .finally(() => {
      pending.delete(key);
      scheduleRelease();
    });
  pending.set(key, job);
  return job;
}
