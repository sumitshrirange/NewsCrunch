import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useFeed } from "../hooks/useFeed";
import { useSummarize } from "../hooks/useSummarize";
import { firstName } from "../utils/helpers";
import NewsFeed from "../components/news/NewsFeed";
import SummaryPanel from "../components/news/SummaryPanel";
import Spinner from "../components/common/Spinner";
import styles from "./Home.module.css";

const Home = () => {
  const { user } = useAuth();
  const feed = useFeed();
  const summarize = useSummarize();

  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");

  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    const updatePlaceholder = () => {
      if (window.innerWidth <= 640) {
        setPlaceholder("https://bbc.com/news/…");
      } else {
        setPlaceholder("https://bbc.com/news/article…");
      }
    };

    updatePlaceholder();
    window.addEventListener("resize", updatePlaceholder);

    return () => window.removeEventListener("resize", updatePlaceholder);
  }, []);

  /* ── Summarize from URL bar ─────────────────── */
  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setUrlError("");
    try {
      await summarize.summarize(urlInput.trim());
    } catch (err) {
      setUrlError(err.message);
    }
  };

  const handlePaste = async () => {
    try {
      setUrlInput(await navigator.clipboard.readText());
    } catch {
      /* denied */
    }
  };

  /* ── Summarize from feed card ───────────────── */
  const handleCardSummarize = async (item) => {
    try {
      await summarize.summarize(item.url, item.thumbnail);
    } catch {
      /* error shown inside hook */
    }
  };

  return (
    <div className={styles.page}>
      {/* ── Hero ──────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`${styles.heroContent} container`}>
          <div className={styles.heroSplit}>
            <div className={styles.heroText}>
              <div className={styles.heroTag}>AI-Powered News Digest</div>
              <h1 className={styles.heroTitle}>
                News in <em>seconds</em>,<br />
                not minutes.
              </h1>
              <p className={styles.heroSub}>
                Hey {firstName(user?.name) || "there"} 👋 — browse today's top
                stories below, or paste any URL to get an instant AI summary.
              </p>
            </div>

            {/* URL card */}
            <div className={styles.urlCard}>
              <div className={styles.urlCardLabel}>✦ Paste any article URL</div>
              <form className={styles.urlForm} onSubmit={handleUrlSubmit}>
                <div className={styles.urlInputWrap}>
                  <span className={styles.urlIcon}>🔗</span>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder={placeholder}
                    className={styles.urlInput}
                    disabled={summarize.loading}
                  />
                  <button
                    type="button"
                    className={styles.btnPaste}
                    onClick={handlePaste}
                  >
                    Paste
                  </button>
                </div>
                <button
                  type="submit"
                  className={styles.btnCrunch}
                  disabled={summarize.loading || !urlInput.trim()}
                >
                  {summarize.loading ? (
                    <>
                      <Spinner size="sm" /> Analyzing…
                    </>
                  ) : (
                    "Crunch It →"
                  )}
                </button>
              </form>
              {urlError && <p className={styles.urlError}>{urlError}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* ── News feed ─────────────────────────────── */}
      <div className="container">
        <NewsFeed
          articles={feed.articles}
          loading={feed.loading}
          loadingMore={feed.loadingMore}
          error={feed.error}
          hasMore={feed.hasMore}
          category={feed.category}
          searchQuery={feed.searchQuery}
          onSummarize={handleCardSummarize}
          summarizingUrl={summarize.summarizingUrl}
          onLoadMore={feed.loadMore}
          onRefresh={feed.refresh}
          onCategoryChange={feed.changeCategory}
          onSearch={feed.search}
        />
      </div>

      {/* ── Summary panel overlay ─────────────────── */}
      {summarize.result && (
        <SummaryPanel
          article={summarize.result}
          cached={summarize.cached}
          onClose={summarize.clear}
        />
      )}

      {/* ── Global loading overlay ────────────────── */}
      {summarize.loading && !summarize.result && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingCard}>
            <Spinner />
            <p>Scraping &amp; summarizing with AI…</p>
            <span>This takes a few seconds</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
