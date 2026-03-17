import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Footer.module.css";

const Footer = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (["/login", "/register"].includes(pathname)) return null;

  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} container`}>
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brandCol}>
            <Link to="/" className={styles.brand}>
              <span className={styles.brandIcon}>✦</span>
              <span className={styles.brandName}>NewsCrunch</span>
            </Link>
            <p className={styles.tagline}>
              AI-powered news digests — instant summaries, key points, and
              sentiment analysis for any article on the web.
            </p>
            <div className={styles.badges}>
              {["Gemini AI", "SerpAPI", "MERN Stack"].map((b) => (
                <span key={b} className={styles.techBadge}>
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className={styles.navGrid}>
            <div className={styles.navGroup}>
              <h4 className={styles.navHeading}>Product</h4>
              <nav className={styles.navList}>
                {user ? (
                  <>
                    <Link to="/" className={styles.navLink}>
                      News Feed
                    </Link>
                    <Link to="/history" className={styles.navLink}>
                      My History
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={styles.navLink}>
                      Sign In
                    </Link>
                    <Link to="/register" className={styles.navLink}>
                      Get Started
                    </Link>
                  </>
                )}
              </nav>
            </div>

            <div className={styles.navGroup}>
              <h4 className={styles.navHeading}>Powered By</h4>
              <nav className={styles.navList}>
                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  Google Gemini ↗
                </a>
                <a
                  href="https://serpapi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  SerpAPI ↗
                </a>
              </nav>
            </div>

            <div className={styles.navGroup}>
              <h4 className={styles.navHeading}>Developer</h4>
              <nav className={styles.navList}>
                <a
                  href="https://sumit-shrirange.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  Portfolio ↗
                </a>
                <a
                  href="https://www.linkedin.com/in/sumitshrirange"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  LinkedIn ↗
                </a>
                <a
                  href="https://github.com/sumitshrirange"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  GitHub ↗
                </a>
                <a
                  href="mailto:sumitshrirange.in@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  Email ↗
                </a>
              </nav>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {year} NewsCrunch. Built with{" "}
            <span className={styles.heartPulse}>&#9829;</span> by Sumit
            Shrirange.
          </p>
          <div className={styles.bottomRight}>
            <span className={styles.status}>
              <span className={styles.statusDot} />
              The system is up-to-date
            </span>
            <span className={styles.version}>v1.0.6</span>
          </div>
        </div>
      </div>

      <div className={styles.accentBar} />
    </footer>
  );
};

export default Footer;
