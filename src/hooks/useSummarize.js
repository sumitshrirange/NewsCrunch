import { useState } from "react";
import { summarizeUrl } from "../services/api";

export const useSummarize = () => {
  const [result, setResult] = useState(null);
  const [cached, setCached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summarizingUrl, setSummarizingUrl] = useState("");
  const [error, setError] = useState("");

  const summarize = async (url, thumbnail = "") => {
    setLoading(true);
    setSummarizingUrl(url);
    setError("");
    setResult(null);
    try {
      const { data } = await summarizeUrl(url, thumbnail);
      setResult(data.article);
      setCached(data.cached);
      return data.article;
    } catch (err) {
      const msg = err.response?.data?.error || "Summarization failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
      setSummarizingUrl("");
    }
  };

  const clear = () => {
    setResult(null);
    setError("");
    setCached(false);
  };

  return { result, cached, loading, summarizingUrl, error, summarize, clear };
};
