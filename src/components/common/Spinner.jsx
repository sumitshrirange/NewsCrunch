import React from "react";

const Spinner = ({ fullPage = false, size = "md", dark = false }) => {
  const cls = size === "sm" ? "spinner-sm" : "spinner";
  const mod = dark ? " spinner-dark" : "";

  if (fullPage) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div className={cls + mod} />
        <p
          style={{
            color: "var(--muted)",
            fontSize: 14,
            fontFamily: "var(--font-sans)",
          }}
        >
          Loading…
        </p>
      </div>
    );
  }

  return <span className={cls + mod} />;
};

export default Spinner;
