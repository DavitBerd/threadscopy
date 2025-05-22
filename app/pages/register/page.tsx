"use client";
import { useForm } from "react-hook-form";
import { auth } from "../../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./Register.module.scss";

type FormData = {
  email: string;
  password: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      console.log("User registered successfully");
      router.push("/");
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
                pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
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
          <button type="submit" className={styles.registerButton}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
