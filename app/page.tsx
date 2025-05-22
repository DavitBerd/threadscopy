"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import styles from "./Home.module.scss";
import { auth } from "./firebase/config";
import { useStore } from "./store/store";
import Sidebar from "./components/Sidebar";
import Post from "./components/post";
import CreatePost from "./components/createPosts";
import { UserType } from "./types";


export default function Home() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { posts, updatePost } = useStore();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser as UserType | null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar user={user} />

      <main className={styles.main}>
        <h1 className={styles.title}>Home</h1>

        {user && <CreatePost user={user} />}

        <div className={styles.posts}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                user={user}
                updatePost={updatePost}
              />
            ))
          ) : (
            <div className={styles.noPosts}>No posts available</div>
          )}
        </div>
      </main>

      <div className={styles.rightSidebar}>
        {!user && (
          <div className={styles.authCard}>
            <h2>Sign in or register for Threads</h2>
            <p>
              Discover what people are talking about and join the conversation.
            </p>
            <button
              className={styles.authButton}
              onClick={() => router.push("/pages/login")}
            >
              Sign in with username
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
