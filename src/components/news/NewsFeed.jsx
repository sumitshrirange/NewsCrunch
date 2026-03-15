import React, { useRef, useState } from "react";
import { CATEGORIES } from "../../utils/constants";
import NewsCard from "./NewsCard";
import styles from "./NewsFeed.module.css";
import { IoMdRefresh } from "react-icons/io";

const SkeletonCard = () => (
  <div className={styles.skeleton}>
    <div className={`${styles.skThumb} skeleton`} />
    <div className={styles.skBody}>
      <div className={`${styles.skLine} ${styles.long}  skeleton`} />
      <div className={`${styles.skLine} ${styles.med}   skeleton`} />
      <div className={`${styles.skLine} ${styles.short} skeleton`} />
    </div>
  </div>
);

const NewsFeed = ({
  articles,
  loading,
  loadingMore,
  error,
  hasMore,
  category,
  searchQuery,
  onSummarize,
  summarizingUrl,
  onLoadMore,
  onRefresh,
  onCategoryChange,
  onSearch,
}) => {
  const [inputVal, setInputVal] = useState(searchQuery || "");
  const formRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(inputVal);
  };

  const clearSearch = () => {
    setInputVal("");
    onSearch("");
  };

  return (
    <section className={styles.section}>
      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Today's Stories</h2>
          <button className={styles.refreshBtn} onClick={onRefresh}>
            <IoMdRefresh /> Refresh
          </button>
        </div>

        {/* Search */}
        <form
          ref={formRef}
          className={styles.searchRow}
          onSubmit={handleSearch}
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search news…"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchBtn}>
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={clearSearch}
            >
              ✕
            </button>
          )}
        </form>

        {/* Category pills */}
        <div className={styles.pills}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.pill} ${category === cat ? styles.pillActive : ""}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className={styles.stateBox}>
          <span style={{ fontSize: 40 }}>⚠️</span>
          <p>{error}</p>
          <button className={styles.retryBtn} onClick={onRefresh}>
            Try Again
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className={styles.stateBox}>
          <span style={{ fontSize: 40 }}>📭</span>
          <p>No articles found for this query.</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {articles.map((item, i) => (
              <NewsCard
                key={`${item.url}-${i}`}
                item={item}
                onSummarize={onSummarize}
                isSummarizing={summarizingUrl === item.url}
              />
            ))}
          </div>

          {hasMore && (
            <div className={styles.loadMoreWrap}>
              <button
                className={styles.loadMoreBtn}
                onClick={onLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <span
                      className="spinner-sm spinner-dark"
                      style={{ display: "inline-block" }}
                    />{" "}
                    Loading…
                  </>
                ) : (
                  "Load More Stories"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default NewsFeed;
