import { useCallback, useEffect, useState } from "react";
import { getNewsFeed } from "../services/api";

export const useFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const load = useCallback(
    async (pg = 1, append = false) => {
      if (pg === 1) setLoading(true);
      else setLoadingMore(true);
      setError("");
      try {
        const { data } = await getNewsFeed({
          q: searchQuery || "latest news",
          category: category === "All" ? "" : category,
          page: pg,
        });
        const incoming = data.articles || [];
        setArticles((prev) => (append ? [...prev, ...incoming] : incoming));
        setHasMore(incoming.length === 20);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load news feed");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery, category],
  );

  // Reload when filters change
  useEffect(() => {
    setPage(1);
    load(1, false);
  }, [load]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    load(next, true);
  };

  const refresh = () => load(1, false);

  const changeCategory = (cat) => {
    setCategory(cat);
    setSearchQuery("");
  };

  const search = (q) => setSearchQuery(q);

  return {
    articles,
    loading,
    loadingMore,
    error,
    hasMore,
    category,
    searchQuery,
    loadMore,
    refresh,
    changeCategory,
    search,
  };
};
