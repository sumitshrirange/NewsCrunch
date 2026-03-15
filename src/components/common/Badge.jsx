import React from "react";
import { SENTIMENT, CATEGORY_COLORS } from "../../utils/constants";

export const SentimentBadge = ({ sentiment }) => {
  const s = SENTIMENT[sentiment] || SENTIMENT.neutral;
  return (
    <span className={`badge ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  );
};

export const CategoryBadge = ({ category, variant = "dark" }) => {
  if (variant === "outline") {
    const color = CATEGORY_COLORS[category] || "#94a3b8";
    return (
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "1px",
          textTransform: "uppercase",
          color,
          border: `1.5px solid ${color}`,
          padding: "2px 8px",
          borderRadius: "var(--radius-sm)",
        }}
      >
        {category}
      </span>
    );
  }
  return <span className="badge badge-category">{category}</span>;
};

export const SourceBadge = ({ domain }) =>
  domain ? (
    <span
      style={{
        fontSize: 12,
        color: "var(--muted)",
        fontFamily: "var(--font-mono)",
      }}
    >
      {domain}
    </span>
  ) : null;
