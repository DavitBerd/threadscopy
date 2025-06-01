"use client";

import { useForm } from "react-hook-form";
import { auth } from "../../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import styles from "./Register.module.scss";
import Link from "next/link";
import { useState } from "react";
import LoginPopup from "@/app/components/LoginPopup";

interface FormData {
  email: string;
  password: string;
}

const errorMessages: Record<string, string> = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password":
    "Password is too weak. It must be at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Please check your connection.",
  default: "An unexpected error occurred. Please try again.",
};

const Register = () => {
  const { register, handleSubmit, setError } = useForm<FormData>({
    mode: "onBlur",
  });
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      router.push("/");
    } catch (error: unknown) {
      let message = errorMessages.default;

      if (error instanceof FirebaseError) {
        const errorCode = error.code || "default";
        message = errorMessages[errorCode] || errorMessages.default;

        if (
          errorCode === "auth/email-already-in-use" ||
          errorCode === "auth/weak-password"
        ) {
          setError(errorCode.includes("email") ? "email" : "password", {
            type: "manual",
          });
        }
      }

      setPopupMessage(message);
      setShowPopup(true);
    } finally {
      setIsSubmitting(false);
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
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              })}
              placeholder="Email"
              className={styles.input}
            />
          </div>
          <div>
            <input
              {...register("password", {
                required: true,
                minLength: 6,
              })}
              type="password"
              placeholder="Password"
              className={styles.input}
            />
          </div>
          <button
            type="submit"
            className={styles.registerButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
        <div className={styles.loginLink}>
          Already have an account? <Link href="/pages/login">Log in</Link>
        </div>
      </div>

      <LoginPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title={
          popupMessage.includes("already exists")
            ? "Account Already Exists"
            : "Registration Error"
        }
        message={popupMessage}
        buttonText={
          popupMessage.includes("already exists") ? "Log in Now" : "Try Again"
        }
        redirectPath={
          popupMessage.includes("already exists") ? "/pages/login" : undefined
        }
        variant="error"
      />
    </div>
  );
};

export default Register;
