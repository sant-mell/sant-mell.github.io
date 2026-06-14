import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt =
  "Santiago Aguilar Mello, Computer Science (ITC) student at Tec de Monterrey";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image(): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(1200px 600px at 0% 0%, #27272a 0%, #0a0a0a 55%)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "76px",
              height: "76px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #27272a 0%, #52525b 100%)",
              fontSize: "38px",
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            SA
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "30px",
              fontWeight: 600,
              color: "#d4d4d8",
            }}
          >
            Santiago Aguilar Mello
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "26px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "70px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              backgroundImage:
                "linear-gradient(90deg, #ffffff 0%, #d4d4d8 45%, #a1a1aa 100%)",
              backgroundClip: "text",
              color: "transparent",
              maxWidth: "1000px",
            }}
          >
            Computer Science (ITC) student, Tec de Monterrey
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "36px",
              fontWeight: 500,
              color: "#d4d4d8",
              maxWidth: "960px",
            }}
          >
            Cybersecurity, Network Engineering and Cisco CCNA track
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "28px",
              fontWeight: 600,
              color: "#a1a1aa",
            }}
          >
            sant-mell.github.io
          </div>
          <div
            style={{
              display: "flex",
              width: "220px",
              height: "8px",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #52525b 0%, #a1a1aa 100%)",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
