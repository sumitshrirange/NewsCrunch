import React, { useState } from "react";
import { timeAgo } from "../../utils/helpers";
import styles from "./NewsCard.module.css";

const NewsCard = ({ item, onSummarize, isSummarizing }) => {
  const [imgErr, setImgErr] = useState(false);

  return (
    <article className={`${styles.card} ${isSummarizing ? styles.busy : ""}`}>
      {/* Thumbnail */}
      <div className={styles.thumb}>
        {item.thumbnail && !imgErr ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            onError={() => setImgErr(true)}
            loading="lazy"
          />
        ) : (
          <div className={styles.thumbPlaceholder}>📰</div>
        )}
        {item.source && (
          <span className={styles.sourceBadge}>{item.source}</span>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.title}>{item.title}</h3>
        {item.snippet && <p className={styles.snippet}>{item.snippet}</p>}

        <div className={styles.footer}>
          {item.publishedAt && (
            <span className={styles.time}>{timeAgo(item.publishedAt)}</span>
          )}
          <div className={styles.actions}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnGhost}
              onClick={(e) => e.stopPropagation()}
            >
              Source ↗
            </a>
            <button
              className={styles.btnCrunch}
              onClick={() => onSummarize(item)}
              disabled={isSummarizing}
            >
              {isSummarizing ? (
                <>
                  <span
                    className="spinner-sm"
                    style={{ display: "inline-block" }}
                  />{" "}
                  Crunching…
                </>
              ) : (
                "✦ Crunch"
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
