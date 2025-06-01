"use client";

import { useForm } from "react-hook-form";
import { auth } from "../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import styles from "./Login.module.scss";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import LoginPopup from "@/app/components/LoginPopup";

interface FormData {
  emailOrPhone: string;
  password: string;
}

const errorMessages: Record<string, string> = {
  "auth/user-not-found": "No account found with this email or phone.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/invalid-credential": "Invalid credentials provided.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Please check your connection.",
  default: "An unexpected error occurred. Please try again.",
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    mode: "onBlur",
  });
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      setGeneralError(null);
      await signInWithEmailAndPassword(auth, data.emailOrPhone, data.password);
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code || "default";
        const message = errorMessages[errorCode] || errorMessages.default;

        setPopupMessage(message);
        setShowPopup(true);

        if (errorCode === "auth/user-not-found") {
          setError("emailOrPhone", { type: "manual", message });
        } else if (errorCode === "auth/wrong-password") {
          setError("password", { type: "manual", message });
        } else {
          setGeneralError(message);
        }
      } else {
        setGeneralError(errorMessages.default);
        setPopupMessage(errorMessages.default);
        setShowPopup(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.loginBox}>
        <p className={styles.heading}>Log in with your Instagram account</p>

        {generalError && (
          <p className={styles.error} aria-live="assertive">
            {generalError}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <input
            {...register("emailOrPhone", {
              required: "Username, phone, or email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$|^[\+]?[0-9]{10,}$/,
                message: "Enter a valid email or phone number",
              },
            })}
            placeholder="Username, phone, or email"
            className={styles.input}
          />
          {errors.emailOrPhone && (
            <p className={styles.error} aria-live="assertive">
              {errors.emailOrPhone.message}
            </p>
          )}

          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type="password"
            placeholder="Password"
            className={styles.input}
          />
          {errors.password && (
            <p className={styles.error} aria-live="assertive">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>

          <div className={styles.forgot}>
            <a href="https://www.instagram.com/accounts/password/reset/">
              Forgot password?
            </a>
          </div>
        </form>

        <div className={styles.divider}>--or--</div>
        <Link href="/pages/register" className={styles.instagramButton}>
          Continue with Instagram
        </Link>
      </div>
      <footer className={styles.footer}>
        <p>
          © 2025 Threads | <a href="#">Terms</a> |{" "}
          <a href="#">Privacy Policy</a> | <a href="#">Cookies Policy</a> |{" "}
          <a href="#">Report a problem</a>
        </p>
        <div className={styles.qrSection}>
          <p>Scan to get the app</p>
          <QRCodeCanvas
            value="https://www.threads.net/download/redirect"
            size={100}
            className={styles.qrcode}
          />
        </div>
      </footer>

      <LoginPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title={popupMessage.includes("not found") ? "Account Not Found" : "Login Error"}
        message={popupMessage}
        buttonText={popupMessage.includes("not found") ? "Register Now" : "Try Again"}
        redirectPath={popupMessage.includes("not found") ? "/pages/register" : undefined}
        variant="error"
      />
    </main>
  );
};

export default Login;