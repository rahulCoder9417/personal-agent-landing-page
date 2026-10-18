"use client";

import { useEffect, useRef, useState } from "react";

// The 53-second product video (public/video/, made from marketing/demo-video/out/textcrew-short.mp4).
// It plays muted, on a loop, while most of it is on screen, and pauses when it scrolls away. It never
// starts with sound: "Watch with sound" starts it again from the top, unmuted. Once the viewer uses the
// player themselves, it is left alone. No autoplay for people who ask for less motion or save data.
export function DemoVideo({ className = "" }: { className?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const touched = useRef(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (touched.current) return;
        if (entry.isIntersecting) {
          el.muted = true;
          el.play()
            .then(() => setPreview(true))
            .catch(() => setPreview(false));
        } else if (!el.paused) {
          el.pause();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The viewer took over (a click on the player or its controls, or the keyboard).
  const takeOver = () => {
    touched.current = true;
    setPreview(false);
  };

  const withSound = () => {
    const el = video.current;
    if (!el) return;
    takeOver();
    el.currentTime = 0;
    el.muted = false;
    void el.play();
  };

  return (
    <div className={`relative overflow-hidden rounded-[22px] border border-line bg-surface shadow-window ${className}`}>
      <video
        ref={video}
        className="block aspect-video h-auto w-full bg-surface"
        poster="/video/textcrew-demo-poster.jpg"
        controls
        playsInline
        muted
        loop={preview}
        preload="metadata"
        width={1280}
        height={720}
        aria-label="Textcrew in 53 seconds: one text, the crew at work, your OK, done."
        onPointerDown={takeOver}
        onKeyDown={takeOver}
      >
        <source src="/video/textcrew-demo.webm" type="video/webm" />
        <source src="/video/textcrew-demo.mp4" type="video/mp4" />
        Your browser can&apos;t play this video.{" "}
        <a href="/video/textcrew-demo.mp4">Download it</a> instead.
      </video>
      {preview && (
        <button
          type="button"
          onClick={withSound}
          className="absolute left-3 top-3 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-fg/80 px-3 text-[12.5px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-fg sm:left-4 sm:top-4 sm:h-9 sm:px-3.5 sm:text-[13px]"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H3v6h3l5 4V5z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>
          Watch with sound
        </button>
      )}
    </div>
  );
}
