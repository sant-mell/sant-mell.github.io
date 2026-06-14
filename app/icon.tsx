import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #27272a 0%, #52525b 100%)",
          color: "#ffffff",
          fontSize: "34px",
          fontWeight: 800,
          letterSpacing: "-0.02em",
        }}
      >
        SA
      </div>
    ),
    {
      ...size,
    },
  );
}
