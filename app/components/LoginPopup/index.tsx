"use client";

import { useRouter } from "next/navigation";
import styles from "./LoginPopup.module.scss";

type LoginPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  redirectPath?: string;
  variant?: "login" | "register" | "error" | "success";
};

const LoginPopup = ({
  isOpen,
  onClose,
  title = "Say more with Threads",
  message = "Join Threads to share thoughts, find out what's going on, follow your people and more.",
  buttonText = "Continue with Instagram",
  redirectPath = "/pages/login",
  variant = "login",
}: LoginPopupProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleAction = () => {
    onClose();
    if (redirectPath) {
      router.push(redirectPath);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "error":
        return styles.errorVariant;
      case "success":
        return styles.successVariant;
      case "register":
        return styles.registerVariant;
      default:
        return "";
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.content} ${getVariantStyles()}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close popup"
        >
          ✕
        </button>

        <div className={styles.body}>
          <h2>{title}</h2>
          <p>{message}</p>

          {variant === "login" || variant === "register" ? (
            <div className={styles.options}>
              <button className={styles.actionButton} onClick={handleAction}>
                <div className={styles.icon}>
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
                <span className={styles.buttonText}>{buttonText}</span>
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
          ) : (
            <button className={styles.simpleButton} onClick={handleAction}>
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
