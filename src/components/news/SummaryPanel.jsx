import React from "react";
import { Link } from "react-router-dom";
import { SentimentBadge, CategoryBadge, SourceBadge } from "../common/Badge";
import { pad2 } from "../../utils/helpers";
import styles from "./SummaryPanel.module.css";

const SummaryPanel = ({ article, cached, onClose }) => {
  if (!article) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        {cached && (
          <div className={styles.cachedBanner}>📦 From your cache</div>
        )}

        {article.thumbnail && (
          <div className={styles.thumb}>
            <img
              src={article.thumbnail}
              alt={article.title}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        <div className={styles.meta}>
          <CategoryBadge category={article.category} />
          <SentimentBadge sentiment={article.sentiment} />
          <SourceBadge domain={article.sourceDomain} />
          <span className={styles.readTime}>⏱ {article.readTime}m read</span>
        </div>

        <h2 className={styles.title}>{article.title}</h2>

        <div className={styles.summaryBlock}>
          <div className={styles.label}>✦ AI Summary</div>
          <p>{article.summary}</p>
        </div>

        {article.keyPoints?.length > 0 && (
          <div className={styles.keyPoints}>
            <div className={styles.label}>Key Points</div>
            <ul>
              {article.keyPoints.map((pt, i) => (
                <li key={i}>
                  <span className={styles.kpNum}>{pad2(i + 1)}</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.actions}>
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnPrimary}
          >
            Read Full Article ↗
          </a>
          <Link
            to={`/article/${article._id}`}
            className={styles.btnSecondary}
            onClick={onClose}
          >
            View Report
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;
