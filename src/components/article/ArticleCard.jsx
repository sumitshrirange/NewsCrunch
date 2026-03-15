import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SentimentBadge, CategoryBadge } from "../common/Badge";
import { CATEGORY_COLORS } from "../../utils/constants";
import styles from "./ArticleCard.module.css";

const ArticleCard = ({ article, onDelete }) => {
  const [imgErr, setImgErr] = useState(false);
  const color = CATEGORY_COLORS[article.category] || "#94a3b8";

  return (
    <div className={`${styles.card} fade-up`}>
      {/* Thumbnail */}
      <div className={styles.thumb} style={{ "--cat": color }}>
        {article.thumbnail && !imgErr ? (
          <img
            src={article.thumbnail}
            alt={article.title}
            onError={() => setImgErr(true)}
            loading="lazy"
          />
        ) : (
          <div className={styles.thumbPlaceholder}>📰</div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content} style={{ "--cat": color }}>
        <div className={styles.top}>
          <div className={styles.badges}>
            <CategoryBadge category={article.category} variant="outline" />
            <SentimentBadge sentiment={article.sentiment} />
          </div>
          <span className={styles.source}>{article.sourceDomain}</span>
        </div>

        <h3 className={styles.title}>{article.title}</h3>
        <p className={styles.summary}>{article.summary}</p>

        {article.keyPoints?.length > 0 && (
          <ul className={styles.points}>
            {article.keyPoints.slice(0, 2).map((pt, i) => (
              <li key={i}>{pt}</li>
            ))}
          </ul>
        )}

        <div className={styles.footer}>
          <div className={styles.stats}>
            <span>⏱ {article.readTime}m</span>
            <span>
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className={styles.actions}>
            <a
              href={article.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnGhost}
            >
              Source ↗
            </a>
            <Link to={`/article/${article._id}`} className={styles.btnRead}>
              Read →
            </Link>
            {onDelete && (
              <button
                className={styles.btnDelete}
                onClick={() => onDelete(article._id)}
                title="Delete"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
