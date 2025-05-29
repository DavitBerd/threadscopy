"use client";

import { useForm } from "react-hook-form";
import { auth } from "../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./Login.module.scss";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";

type FormData = {
  emailOrPhone: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      await signInWithEmailAndPassword(auth, data.emailOrPhone, data.password);
      router.push("/");
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

          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="Password"
            className={styles.input}
          />
          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}

          <button type="submit" className={styles.loginButton}>
            Log in
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
