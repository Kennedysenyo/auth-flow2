"use client";

import Link from "next/link";
import styles from "./Authform.module.css";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useActionState, useEffect } from "react";
import { FormState, validateForm } from "@/actions/auth/validate-form";
import { useRouter } from "next/navigation";

type Props = {
  type: "login" | "signup";
};
export const AuthForm = ({ type }: Props) => {
  const isLoginPage = type === "login";
  const router = useRouter();

  const initialState: FormState = {
    inputErrors: {},
    success: false,
    errorMessage: null,
  };

  const [state, formAction, isPending] = useActionState(
    validateForm.bind(null, isLoginPage),
    initialState
  );

  useEffect(() => {
    if (state.success) {
      isLoginPage ? router.replace("/") : router.push("/verify-otp");
    }
  }, [router, isLoginPage, state.success]);

  return (
    <div className={`${styles.formContainer}`}>
      <h2>{isLoginPage ? "Login" : "Sign Up"}</h2>
      {state.errorMessage && (
        <p className={`${styles.errorMessage}`}>{state.errorMessage}</p>
      )}
      <form className={styles.form} action={formAction}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="e.g., johndoe@email.com "
          />
          {state.inputErrors.email && (
            <small className={`${styles.errorMessage}`}>
              {state.inputErrors.email}
            </small>
          )}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
          {state.inputErrors.password && (
            <small className={`${styles.errorMessage}`}>
              {state.inputErrors.password}
            </small>
          )}
        </div>
        {!isLoginPage && (
          <div>
            <label htmlFor="cnfm-password">Confirm Password:</label>
            <input type="password" id="cnfm-password" name="cnfm-password" />
            {state.inputErrors.cnfmPassword && (
              <small className={`${styles.errorMessage}`}>
                {state.inputErrors.cnfmPassword}
              </small>
            )}
          </div>
        )}

        <div>
          <button className={`${styles.submitBtn}`}>
            {isPending ? "..." : isLoginPage ? "Login" : "Sign Up"}
          </button>
          <small className={`${styles.suggestion}`}>
            {isLoginPage
              ? "Don't have an account yet?"
              : "Already have an account?"}{" "}
            <Link href={isLoginPage ? "/sign-up" : "/login"}>
              {isLoginPage ? "Sign Up" : "Login"}
            </Link>
          </small>
        </div>

        <div className={`${styles.socialLoginDiv}`}>
          <button disabled={isPending}>
            <FaGoogle size={24} />
          </button>
          <button disabled={isPending}>
            <FaGithub size={24} />
          </button>
        </div>
      </form>
    </div>
  );
};
