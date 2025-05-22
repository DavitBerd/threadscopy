"use client";

import { useForm } from "react-hook-form";
import { auth } from "../../firebase/config";
import {
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import styles from "./Login.module.scss";
import Link from "next/link";

type FormData = {
  emailOrPhone: string;
  password: string;
  verificationCode?: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      if (data.verificationCode && confirmationResult) {
        await confirmationResult.confirm(data.verificationCode);
        router.push("/");
      } else if (data.emailOrPhone.startsWith("+")) {
        const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
        const result = await signInWithPhoneNumber(
          auth,
          data.emailOrPhone,
          appVerifier
        );
        setConfirmationResult(result);
        setShowCodeInput(true);
      } else {
        await signInWithEmailAndPassword(
          auth,
          data.emailOrPhone,
          data.password
        );
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.loginBox}>
        <p className={styles.heading}>Log in with your Instagram account</p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <input
            {...register("emailOrPhone", {
              required: "Username, phone or email is required",
            })}
            placeholder="Username, phone or email"
            className={styles.input}
          />
          {errors.emailOrPhone && (
            <p className={styles.error}>{errors.emailOrPhone.message}</p>
          )}

          {!showCodeInput && (
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              placeholder="Password"
              className={styles.input}
            />
          )}
          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}

          {showCodeInput && (
            <input
              {...register("verificationCode", {
                required: "Verification code is required",
              })}
              placeholder="Enter SMS code"
              className={styles.input}
            />
          )}
          {errors.verificationCode && (
            <p className={styles.error}>{errors.verificationCode.message}</p>
          )}

          <div id="recaptcha-container"></div>

          <button type="submit" className={styles.loginButton}>
            {showCodeInput ? "Verify Code" : "Log in"}
          </button>

          <div className={styles.forgot}>
            <a href="https://www.instagram.com/accounts/password/reset/">
              Forgot password?
            </a>
          </div>
        </form>

        <div className={styles.divider}>--or--</div>

        <button className={styles.instagramButton}>
          <Link href="/pages/register"> Continue with Instagram</Link>
        </button>
      </div>
      <footer className={styles.footer}>
        <p>
          © 2025 Threads | <a href="#">Terms</a> |<a href="#">Privacy Policy</a>{" "}
          |<a href="#">Cookies Policy</a> |<a href="#">Report a problem</a>
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
    </main>
  );
};

export default Login;
