import React from "react";

export default function Logo({ h = 50 }) {
  return (
    <img
      src="/Logo.png"
      style={{ height: h, width: h }}
      className="object-contain"
      alt="Logo"
/>
  );
}

