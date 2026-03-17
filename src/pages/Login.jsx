import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { googleAuth, login as apiLogin } from "../services/api";
import styles from "./Auth.module.css";
import Spinner from "../components/common/Spinner";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [gLoad, setGLoad] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  useEffect(() => {
    const id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!id || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: id,
      callback: handleGoogle,
    });
    window.google.accounts.id.renderButton(document.getElementById("g-btn"), {
      theme: "outline",
      size: "large",
      width: "100%",
      text: "signin_with",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogle = async (resp) => {
    setGLoad(true);
    setError("");
    try {
      const { data } = await googleAuth(resp.credential);
      login(data.accessToken, data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Google sign-in failed");
    } finally {
      setGLoad(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await apiLogin(form);
      login(data.accessToken, data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.lBrand}>
          <span className={styles.lIcon}>✦</span>
          <span className={styles.lName}>NewsCrunch</span>
        </div>
        <h2 className={styles.lTagline}>
          The world's news,
          <br />
          <em>instantly digested.</em>
        </h2>
        <p className={styles.lDesc}>
          Paste any article URL and get an AI-powered summary in seconds. Your
          personal news archive, always organized.
        </p>
        <div className={styles.features}>
          {[
            "AI-powered summaries",
            "Personal history & archive",
            "Sentiment & category tags",
            "Google OAuth support",
          ].map((f) => (
            <div key={f} className={styles.feature}>
              <span>✓</span>
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <h1 className={styles.cardTitle}>Welcome back</h1>
          <p className={styles.cardSub}>Sign in to your account</p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.gWrap}>
            <div id="g-btn" />
            {gLoad && <p>Signing...</p>}
          </div>

          <div className={styles.divider}>
            <span>or continue with email</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                required
                disabled={loading}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>
                Password
                <button
                  type="button"
                  className={styles.showPw}
                  onClick={() => setShowPw((s) => !s)}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </label>
              <input
                type={showPw ? "text" : "password"}
                className={styles.input}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? (
                <>
                  <span
                    className="spinner-sm"
                    style={{ display: "inline-block" }}
                  />{" "}
                  Signing in…
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <p className={styles.switchLine}>
            Don't have an account? <Link to="/register">Create One</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
