"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "firebase/auth";
import styles from "./Sidebar.module.scss";
import { auth } from "@/app/firebase/config";
import { UserType } from "../../types";
import { useStore } from "../../store/store";
import PostCreationWindow from "../postCreationWindow";


type SidebarProps = {
  user: UserType | null;
};

const Sidebar = ({ user }: SidebarProps) => {
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { addPost } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowBottomMenu(false);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProtectedAction = (action: string) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    if (action === "post") {
      setShowPostModal(true);
    } else if (action === "notifications") {
      router.push("/");
    } else if (action === "profile") {
      router.push(`/`);
    }
  };

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <Link href="/" className={styles.sidelogo}>
            Threads
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link
            href="/"
            className={`${styles.navItem} ${
              pathname === "/" ? styles.active : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <Link
            href="/"
            className={`${styles.navItem} ${
              pathname === "/search" ? styles.active : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>
          <button
            className={styles.navItem}
            onClick={() => handleProtectedAction("post")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            className={`${styles.navItem} ${
              pathname === "/notifications" ? styles.active : ""
            }`}
            onClick={() => handleProtectedAction("notifications")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button
            className={`${styles.navItem} ${
              pathname.startsWith("/profile") ? styles.active : ""
            }`}
            onClick={() => handleProtectedAction("profile")}
          >
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || "User"}
                width={24}
                height={24}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.defaultAvatar}>
                {user?.displayName ? user.displayName.charAt(0) : "U"}
              </div>
            )}
          </button>
        </nav>
        <div className={styles.bottomSection}>
          <button
            className={styles.menuButton}
            onClick={() => setShowBottomMenu(!showBottomMenu)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
      <div className={styles.topBar}>
        <div className={styles.logo}>
          <Link href="/">Threads</Link>
        </div>
        {!user && (
          <button
            className={styles.loginButton}
            onClick={() => router.push("/pages/login")}
          >
            Log in
          </button>
        )}
      </div>
      <nav className={styles.bottomNav}>
        <Link
          href="/"
          className={`${styles.navItem} ${
            pathname === "/" ? styles.active : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
        <Link
          href="/"
          className={`${styles.navItem} ${
            pathname === "/search" ? styles.active : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </Link>
        <button
          className={styles.navItem}
          onClick={() => handleProtectedAction("post")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          className={`${styles.navItem} ${
            pathname === "/notifications" ? styles.active : ""
          }`}
          onClick={() => handleProtectedAction("notifications")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <button
          className={`${styles.navItem} ${
            pathname.startsWith("/profile") ? styles.active : ""
          }`}
          onClick={() => handleProtectedAction("profile")}
        >
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || "User"}
              width={24}
              height={24}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.defaultAvatar}>
              {user?.displayName ? user.displayName.charAt(0) : "U"}
            </div>
          )}
        </button>
        <button
          className={styles.navItem}
          onClick={() => setShowBottomMenu(!showBottomMenu)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>
      {showBottomMenu && (
        <div
          className={styles.bottomMenuOverlay}
          onClick={() => setShowBottomMenu(false)}
        >
          <div
            className={styles.bottomMenu}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.menuItem}>
              <span>Appearance</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
            {user && (
              <>
                <div className={styles.menuItem}>
                  <span>Insights</span>
                </div>
                <div className={styles.menuItem}>
                  <span>Settings</span>
                </div>
                <div className={styles.menuDivider}></div>
                <div className={styles.menuItem}>
                  <span>Saved</span>
                </div>
                <div className={styles.menuItem}>
                  <span>Liked</span>
                </div>
                <div className={styles.menuDivider}></div>
              </>
            )}
            <div className={styles.menuItem}>
              <span>Report a problem</span>
            </div>
            {user && (
              <button className={styles.logoutMenuItem} onClick={handleLogout}>
                <span>Log out</span>
              </button>
            )}
          </div>
        </div>
      )}
      {showLoginPrompt && (
        <div className={styles.loginPromptOverlay}>
          <div className={styles.loginPromptContent}>
            <button
              className={styles.loginCloseButton}
              onClick={() => setShowLoginPrompt(false)}
            >
              ✕
            </button>
            <div className={styles.loginPromptBody}>
              <h2>Say more with Threads</h2>
              <p>
                Join Threads to share thoughts, find out what&lsquo;s going on,
                follow your people and more.
              </p>
              <div className={styles.loginOptions}>
                <button
                  className={styles.instagramLogin}
                  onClick={() => {
                    setShowLoginPrompt(false);
                    router.push("/pages/login");
                  }}
                >
                  <div className={styles.instagramIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <defs>
                        <linearGradient
                          id="instagram-gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#833ab4" />
                          <stop offset="50%" stopColor="#fd1d1d" />
                          <stop offset="100%" stopColor="#fcb045" />
                        </linearGradient>
                      </defs>
                      <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="5"
                        ry="5"
                        stroke="url(#instagram-gradient)"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="url(#instagram-gradient)"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle
                        cx="17.5"
                        cy="6.5"
                        r="1.5"
                        fill="url(#instagram-gradient)"
                      />
                    </svg>
                  </div>
                  <div className={styles.loginText}>
                    <span className={styles.loginLabel}>
                      Continue with Instagram
                    </span>
                  </div>
                  <svg
                    className={styles.arrowIcon}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <PostCreationWindow
        user={user}
        showModal={showPostModal}
        setShowModal={setShowPostModal}
        addPost={addPost}
      />
    </>
  );
};

export default Sidebar;
