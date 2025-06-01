"use client";

import { useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "firebase/auth";

import styles from "./Sidebar.module.scss";
import { auth } from "@/app/firebase/config";
import { UserType } from "../../types";
import { useStore } from "../../store/store";
import PostCreationWindow from "../postCreationWindow";
import LoginPopup from "../LoginPopup";

const HomeIcon = () => (
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
);

const SearchIcon = () => (
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
);

const PlusIcon = () => (
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
);

const HeartIcon = () => (
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
);

const MenuIcon = () => (
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
);

const ArrowIcon = () => (
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
);

type SidebarProps = {
  user: UserType | null;
};

const Sidebar = ({ user }: SidebarProps) => {
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { addPost } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  const UserAvatar = () => {
    if (user?.photoURL) {
      return (
        <Image
          src={user.photoURL}
          alt={user.displayName || "User"}
          width={24}
          height={24}
          className={styles.avatar}
          loading="lazy"
        />
      );
    }
    return (
      <div className={styles.defaultAvatar}>
        {user?.displayName ? user.displayName.charAt(0) : "U"}
      </div>
    );
  };

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setShowBottomMenu(false);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleProtectedAction = useCallback(
    async (action: string) => {
      if (!user) {
        setShowLoginPrompt(true);
        return;
      }

      setIsLoading(true);
      try {
        switch (action) {
          case "post":
            setShowPostModal(true);
            break;
          case "notifications":
            await router.push("/notifications");
            break;
          case "profile":
            await router.push(`/profile/${user.uid || user.displayName}`);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Navigation error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [user, router]
  );

  const toggleBottomMenu = useCallback(() => {
    setShowBottomMenu((prev) => !prev);
  }, []);

  const closeBottomMenu = useCallback(() => {
    setShowBottomMenu(false);
  }, []);

  const closeLoginPrompt = useCallback(() => {
    setShowLoginPrompt(false);
  }, []);

  const closePostModal = useCallback(() => {
    setShowPostModal(false);
  }, []);

  const NavItem = ({
    href,
    isActive,
    children,
    onClick,
  }: {
    href?: string;
    isActive?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
  }) => {
    const className = `${styles.navItem} ${isActive ? styles.active : ""} ${
      isLoading ? styles.loading : ""
    }`;

    if (href) {
      return (
        <Link href={href} className={className}>
          {isLoading && <div className={styles.spinner} />}
          {children}
        </Link>
      );
    }

    return (
      <button className={className} onClick={onClick} disabled={isLoading}>
        {isLoading && <div className={styles.spinner} />}
        {children}
      </button>
    );
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
          <NavItem href="/" isActive={pathname === "/"}>
            <HomeIcon />
          </NavItem>

          <NavItem href="/pages/search" isActive={pathname === "/pages/search"}>
            <SearchIcon />
          </NavItem>

          <NavItem onClick={() => handleProtectedAction("post")}>
            <PlusIcon />
          </NavItem>

          <NavItem
            isActive={pathname === "/notifications"}
            onClick={() => handleProtectedAction("notifications")}
          >
            <HeartIcon />
          </NavItem>

          <NavItem
            isActive={pathname.startsWith("/profile")}
            onClick={() => handleProtectedAction("profile")}
          >
            <UserAvatar />
          </NavItem>
        </nav>

        <div className={styles.bottomSection}>
          <button className={styles.menuButton} onClick={toggleBottomMenu}>
            <MenuIcon />
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
        <NavItem href="/" isActive={pathname === "/"}>
          <HomeIcon />
        </NavItem>

        <NavItem href="/pages/search" isActive={pathname === "/pages/search"}>
          <SearchIcon />
        </NavItem>

        <NavItem onClick={() => handleProtectedAction("post")}>
          <PlusIcon />
        </NavItem>

        <NavItem
          isActive={pathname === "/notifications"}
          onClick={() => handleProtectedAction("notifications")}
        >
          <HeartIcon />
        </NavItem>

        <NavItem
          isActive={pathname.startsWith("/profile")}
          onClick={() => handleProtectedAction("profile")}
        >
          <UserAvatar />
        </NavItem>

        <NavItem onClick={toggleBottomMenu}>
          <MenuIcon />
        </NavItem>
      </nav>

      {showBottomMenu && (
        <div className={styles.bottomMenuOverlay} onClick={closeBottomMenu}>
          <div
            className={styles.bottomMenu}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.menuItem}>
              <span>Appearance</span>
              <ArrowIcon />
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
              <button
                className={styles.logoutMenuItem}
                onClick={handleLogout}
                disabled={isLoading}
              >
                {isLoading && <div className={styles.spinner} />}
                <span>Log out</span>
              </button>
            )}
          </div>
        </div>
      )}

      <LoginPopup
        isOpen={showLoginPrompt}
        onClose={closeLoginPrompt}
        title="Say more with Threads"
        message="Join Threads to share thoughts, find out what's going on, follow your people and more."
        buttonText="Continue with Instagram"
        redirectPath="/pages/login"
        variant="login"
      />

      <PostCreationWindow
        user={user}
        showModal={showPostModal}
        setShowModal={closePostModal}
        addPost={addPost}
      />
    </>
  );
};

export default Sidebar;
