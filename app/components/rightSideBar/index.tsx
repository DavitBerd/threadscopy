"use client";

import { useRouter } from "next/navigation";
import styles from "./RightSidebar.module.scss";

export default function RightSidebar() {
  const router = useRouter();

  return (
    <div className={styles.rightSidebar}>
      <div className={styles.authCard}>
        <h2>Sign in or register for Threads</h2>
        <p>Join the conversation!</p>
        <button
          className={styles.authButton}
          onClick={() => router.push("/pages/login")}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
