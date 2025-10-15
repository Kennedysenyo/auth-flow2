"use client";

import { useActionState, useEffect } from "react";
import styles from "./opt-form.module.css";
import { OTPFormState, validateOTPForm } from "@/actions/auth/validateOPT";
import { useRouter } from "next/navigation";

type Props = {
  email: string;
  signupToken?: string;
};

export const OtpForm = ({ email, signupToken }: Props) => {
  const router = useRouter();
  const otpType = signupToken ? "signup" : "recovery";

  const initialState: OTPFormState = {
    errors: {},
    success: false,
    errorMessage: null,
  };

  const [state, formAction, isPending] = useActionState(
    validateOTPForm.bind(null, { email, signupToken }),
    initialState
  );

  useEffect(() => {
    if (initialState.success) {
      if (otpType === "signup") {
        router.replace("/");
      } else {
        router.push("/set-new-password");
      }
    }
  }, [initialState.success, otpType]);

  return (
    <div className={`${styles.otpContainer}`}>
      <h2>Verify OTP code</h2>
      <form action={formAction}>
        <div>
          <label>OTP has been sent to your email</label>
          <input
            type="text"
            name="otp"
            id="otp"
            placeholder="Enter OTP here "
          />
          {state.errors.otp && <small>{state.errors.otp}</small>}
        </div>
        <button>{isPending ? "..." : "Verify"}</button>
      </form>
    </div>
  );
};
