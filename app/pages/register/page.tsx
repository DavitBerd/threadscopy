"use client";
import { useForm } from "react-hook-form";
import { auth, db } from "../../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./Register.module.scss";

type FormData = {
  email: string;
  phone: string;
  password: string;
  username: string;
  verificationCode?: string;
};

const Register = () => {
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
        const result = await confirmationResult.confirm(data.verificationCode);
        await setDoc(doc(db, "users", result.user.uid), {
          username: data.username,
          email: data.email,
          phone: data.phone,
        });
        router.push("/");
      } else if (data.phone) {
        const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
        const result = await signInWithPhoneNumber(
          auth,
          data.phone,
          appVerifier
        );
        setConfirmationResult(result);
        setShowCodeInput(true);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          username: data.username,
          email: data.email,
          phone: data.phone || "",
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h1 className={styles.heading}>Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
              placeholder="Email"
              className={styles.input}
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("phone", {
                pattern: {
                  value: /^\+[1-9]\d{1,14}$/,
                  message: "Invalid phone number (e.g., +1234567890)",
                },
              })}
              placeholder="Phone (e.g., +1234567890)"
              className={styles.input}
            />
            {errors.phone && (
              <p className={styles.error}>{errors.phone.message}</p>
            )}
          </div>
          <div>
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
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("username", { required: "Username is required" })}
              placeholder="Username"
              className={styles.input}
            />
            {errors.username && (
              <p className={styles.error}>{errors.username.message}</p>
            )}
          </div>
          {showCodeInput && (
            <div>
              <input
                {...register("verificationCode", {
                  required: "Verification code is required",
                })}
                placeholder="Enter SMS code"
                className={styles.input}
              />
              {errors.verificationCode && (
                <p className={styles.error}>
                  {errors.verificationCode.message}
                </p>
              )}
            </div>
          )}
          <div id="recaptcha-container"></div>
          <button type="submit" className={styles.registerButton}>
            {showCodeInput ? "Verify Code" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
