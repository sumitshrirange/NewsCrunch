import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { googleAuth, register as apiRegister } from "../services/api";
import styles from "./Auth.module.css";

const Register = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [gLoad, setGLoad] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    const id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!id || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: id,
      callback: handleGoogle,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("g-btn-reg"),
      { theme: "outline", size: "large", width: "100%", text: "signup_with" },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogle = async (resp) => {
    setGLoad(true);
    setError("");
    try {
      const { data } = await googleAuth(resp.credential);
      login(data.accessToken, data.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Google sign-up failed");
    } finally {
      setGLoad(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm)
      return setError("Passwords do not match");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters");
    setLoading(true);
    setError("");
    try {
      const { data } = await apiRegister({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(data.accessToken, data.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][
    strength
  ];
  const strengthColor = [
    "",
    "#e74c3c",
    "#e67e22",
    "#f1c40f",
    "#2ecc71",
    "#27ae60",
  ][strength];

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.lBrand}>
          <span className={styles.lIcon}>✦</span>
          <span className={styles.lName}>NewsCrunch</span>
        </div>
        <h2 className={styles.lTagline}>
          Start your
          <br />
          <em>news journey.</em>
        </h2>
        <p className={styles.lDesc}>
          Create a free account to start summarizing news articles and building
          your personal reading history.
        </p>
        <div className={styles.features}>
          {[
            "Free to use",
            "Unlimited summaries",
            "Private per-account history",
            "JWT + Google OAuth",
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
          <h1 className={styles.cardTitle}>Create account</h1>
          <p className={styles.cardSub}>Join NewsCrunch for free</p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.gWrap}>
            {gLoad ? (
              <div className={styles.gLoading}>
                <span
                  className="spinner-sm spinner-dark"
                  style={{ display: "inline-block" }}
                />{" "}
                Signing up…
              </div>
            ) : (
              <div id="g-btn-reg" />
            )}
          </div>

          <div className={styles.divider}>
            <span>or register with email</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Jane Doe"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
                disabled={loading}
              />
            </div>
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
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                required
                disabled={loading}
              />
              {form.password && (
                <div className={styles.strengthBar}>
                  <div className={styles.strengthTrack}>
                    <div
                      className={styles.strengthFill}
                      style={{
                        width: `${(strength / 5) * 100}%`,
                        background: strengthColor,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: strengthColor,
                    }}
                  >
                    {strengthLabel}
                  </span>
                </div>
              )}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Confirm Password</label>
              <input
                type={showPw ? "text" : "password"}
                className={styles.input}
                placeholder="••••••••"
                value={form.confirm}
                onChange={(e) =>
                  setForm((p) => ({ ...p, confirm: e.target.value }))
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
                  Creating…
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <p className={styles.switchLine}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
