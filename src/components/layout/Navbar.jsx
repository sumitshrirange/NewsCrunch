import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { initials } from "../../utils/helpers";
import styles from "./Navbar.module.css";
import { RiFileHistoryFill } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.inner} container`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandIcon}>✦</span>
          <span className={styles.brandName}>NewsCrunch</span>
        </Link>

        <div className={styles.leftContent}>
          <div className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
            {user && (
              <>
                <Link
                  to="/"
                  className={`${styles.navLink} ${isActive("/") ? styles.active : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Feed
                </Link>
                <Link
                  to="/history"
                  className={`${styles.navLink} ${isActive("/history") ? styles.active : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  History
                </Link>
              </>
            )}
          </div>

          <div className={styles.right}>
            {user ? (
              <div className={styles.userMenu} ref={dropRef}>
                <button
                  className={styles.avatarBtn}
                  onClick={() => setDropdownOpen((o) => !o)}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className={styles.avatarImg}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className={styles.avatarInitials}>
                      {initials(user.name)}
                    </span>
                  )}
                  <span className={styles.userName}>
                    {user.name?.split(" ")[0]}
                  </span>
                  <span className={styles.chevron}>
                    {dropdownOpen ? "▲" : "▼"}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropHeader}>
                      <div className={styles.dropName}>{user.name}</div>
                      <div className={styles.dropEmail}>{user.email}</div>
                      {user.authProvider === "google" && (
                        <span className={styles.providerBadge}>via Google</span>
                      )}
                    </div>
                    <div className={styles.dropDivider} />
                    <Link
                      to="/"
                      className={styles.dropItem}
                      onClick={() => setDropdownOpen(false)}
                    >
                      ✦ Feed
                    </Link>
                    <Link
                      to="/history"
                      className={styles.dropItem}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <RiFileHistoryFill size={12} /> History
                    </Link>
                    <div className={styles.dropDivider} />
                    <button
                      className={`${styles.dropItem} ${styles.dropLogout}`}
                      onClick={handleLogout}
                    >
                      <IoMdLogOut /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.authLinks}>
                <Link to="/login" className={styles.navLink}>
                  Sign In
                </Link>
                <Link to="/register" className={styles.navCta}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
          {user && (
            <button
              className={menuOpen ? styles.hamburgerActive : styles.hamburger}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
