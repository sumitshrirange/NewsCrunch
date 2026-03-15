import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteArticle, getArticle } from "../services/api";
import {
  CategoryBadge,
  SentimentBadge,
  SourceBadge,
} from "../components/common/Badge";
import Spinner from "../components/common/Spinner";
import { pad2 } from "../utils/helpers";
import styles from "./ArticleDetail.module.css";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    getArticle(id)
      .then(({ data }) => setArticle(data.article))
      .catch(() => setError("Article not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this summary?")) return;
    try {
      await deleteArticle(id);
      navigate("/history");
    } catch {
      alert("Failed to delete.");
    }
  };

  const handleCopy = () => {
    if (!article) return;
    const text = [
      article.title,
      "\nSummary:\n" + article.summary,
      "\nKey Points:\n" +
        article.keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n"),
      "\nSource: " + article.originalUrl,
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <Spinner fullPage />;

  if (error)
    return (
      <div className={`${styles.page} container`}>
        <div className="error-banner">{error}</div>
        <Link to="/history" className={styles.backLink}>
          ← Back to History
        </Link>
      </div>
    );

  const date = new Date(article.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`${styles.page} container fade-up`}>
      <nav className={styles.breadcrumb}>
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/history">Archive</Link>
        <span>›</span>
        <span>{article.category}</span>
      </nav>

      <article className={styles.card}>
        {/* Hero image */}
        {article.thumbnail && !imgErr && (
          <div className={styles.heroThumb}>
            <img
              src={article.thumbnail}
              alt={article.title}
              onError={() => setImgErr(true)}
            />
            <div className={styles.thumbOverlay} />
          </div>
        )}

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.metaRow}>
            <CategoryBadge category={article.category} />
            <SentimentBadge sentiment={article.sentiment} />
            <SourceBadge domain={article.sourceDomain} />
          </div>
          <h1 className={styles.title}>{article.title}</h1>
          <div className={styles.subline}>
            <span>📅 {date}</span>
            <span>⏱ {article.readTime} min read</span>
          </div>
        </header>

        {/* Summary */}
        <section className={styles.summaryBlock}>
          <div className={styles.sectionLabel}>✦ AI Summary</div>
          <p className={styles.summaryText}>{article.summary}</p>
        </section>

        {/* Key points */}
        {article.keyPoints?.length > 0 && (
          <section className={styles.keyPoints}>
            <div className={styles.sectionLabel}>Key Points</div>
            <ol className={styles.kpList}>
              {article.keyPoints.map((pt, i) => (
                <li key={i}>
                  <span className={styles.kpNum}>{pad2(i + 1)}</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Metadata grid */}
        <section className={styles.metaGrid}>
          {[
            ["Category", article.category],
            ["Sentiment", article.sentiment],
            ["Read Time", `${article.readTime} min`],
            ["Source", article.sourceDomain || "—"],
            ["Summarized", new Date(article.createdAt).toLocaleDateString()],
          ].map(([label, val]) => (
            <div key={label} className={styles.metaItem}>
              <div className={styles.metaLabel}>{label}</div>
              <div className={styles.metaValue}>{val}</div>
            </div>
          ))}
        </section>

        {/* Original URL */}
        <section className={styles.urlBlock}>
          <div className={styles.sectionLabel}>Original Article</div>
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.urlLink}
          >
            {article.originalUrl}
          </a>
        </section>

        {/* Actions */}
        <footer className={styles.actions}>
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnPrimary}
          >
            Read Full Article ↗
          </a>
          <button className={styles.btnCopy} onClick={handleCopy}>
            {copied ? "✓ Copied!" : "⎘ Copy Summary"}
          </button>
          <Link to="/history" className={styles.btnGhost}>
            ← Archive
          </Link>
          <button className={styles.btnDelete} onClick={handleDelete}>
            Delete
          </button>
        </footer>
      </article>
    </div>
  );
};

export default ArticleDetail;
