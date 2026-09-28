import { ImageResponse } from "next/og";

export const alt = "Textcrew: message it like a person, it gets the work done. Private beta, launching soon.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#FBFAF7",
          padding: "72px 88px",
          color: "#151515",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 680 }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 30, fontWeight: 700 }}>
            textcrew
            <div style={{ width: 14, height: 30, background: "#3355F5", marginLeft: 6 }} />
          </div>
          <div style={{ marginTop: 40, fontSize: 76, fontWeight: 800, lineHeight: 1, letterSpacing: -3 }}>
            Message it like a person. It gets the work done.
          </div>
          <div
            style={{
              marginTop: 40,
              display: "flex",
              alignSelf: "flex-start",
              padding: "10px 18px",
              borderRadius: 999,
              border: "2px solid #E8E5DE",
              background: "#FFFFFF",
              fontSize: 24,
              color: "#6A6862",
            }}
          >
            Private beta · Launching soon
          </div>
        </div>
        <div
          style={{
            width: 300,
            height: 270,
            borderRadius: 88,
            background: "#3355F5",
            borderBottom: "16px solid #2440C4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 224,
              height: 164,
              borderRadius: 52,
              background: "#16151A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 52,
            }}
          >
            <div style={{ width: 32, height: 32, background: "#FFFFFF" }} />
            <div style={{ width: 32, height: 32, background: "#FFFFFF" }} />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
