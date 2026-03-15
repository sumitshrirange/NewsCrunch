import React, { useCallback, useEffect, useState } from "react";
import { getArticles, deleteArticle } from "../services/api";
import { HISTORY_CATEGORIES } from "../utils/constants";
import ArticleCard from "../components/article/ArticleCard";
import Spinner from "../components/common/Spinner";
import styles from "./History.module.css";

const History = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchArticles = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError("");
      try {
        const { data } = await getArticles({
          page,
          limit: 12,
          category: category === "All" ? "" : category,
          search,
        });
        setArticles(data.articles);
        setPagination(data.pagination);
      } catch {
        setError("Failed to load articles. Is the backend running?");
      } finally {
        setLoading(false);
      }
    },
    [category, search],
  );

  useEffect(() => {
    fetchArticles(1);
  }, [fetchArticles]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this summary?")) return;
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a._id !== id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch {
      alert("Failed to delete article.");
    }
  };

  return (
    <div className={`${styles.page} container`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Archive</h1>
          <p className={styles.sub}>
            {pagination.total} article{pagination.total !== 1 ? "s" : ""}{" "}
            summarized
          </p>
        </div>

        <form
          className={styles.searchForm}
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(searchInput);
          }}
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search articles…"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchBtn}>
            Search
          </button>
          {search && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => {
                setSearch("");
                setSearchInput("");
              }}
            >
              ✕
            </button>
          )}
        </form>
      </div>

      {/* Category filter */}
      <div className={styles.filter}>
        {HISTORY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.catBtn} ${category === cat ? styles.catActive : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <Spinner fullPage />
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : articles.length === 0 ? (
        <div className={styles.empty}>
          <span>📰</span>
          <h3>No articles yet</h3>
          <p>Go to the feed and summarize your first article!</p>
        </div>
      ) : (
        <>
          <div className="article-grid">
            {articles.map((a) => (
              <ArticleCard key={a._id} article={a} onDelete={handleDelete} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => fetchArticles(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                ← Prev
              </button>
              <span className={styles.pageInfo}>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                className={styles.pageBtn}
                onClick={() => fetchArticles(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;
