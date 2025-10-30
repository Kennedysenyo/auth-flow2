"use client";

import { useActionState, useEffect, useState } from "react";
import styles from "./opt-form.module.css";
import { OTPFormState, validateOTPForm } from "@/actions/auth/validateOPT";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/spinner/spinner";

type Props = {
  email: string;
  signupToken?: string;
};

export const OtpForm = ({ email, signupToken }: Props) => {
  const [isResendingOTP, setIsResendingOTP] = useState<boolean>(false);
  const [resendErrorMessage, setResendErrorMessage] = useState<string | null>(
    null
  );
  const router = useRouter();
  const otpType = signupToken ? "signup" : "recovery";

  /** Handle OTP code resend */
  const handleResend = async () => {
    try {
      setIsResendingOTP(true);
      const res = await fetch("/api/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token: signupToken, type: otpType }),
      });

      if (!res.ok) {
        const error = await res.json();
        setResendErrorMessage(error.error.message);
      }
      const data = res.json();

      if (!data) throw new Error("Failed to resend OTP");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResendErrorMessage(error.message);
      }
      setResendErrorMessage(error as string);
    } finally {
      setIsResendingOTP(false);
    }
  };
  const initialState: OTPFormState = {
    errors: {},
    success: false,
    errorMessage: null,
  };

  const [state, formAction, isPending] = useActionState(
    validateOTPForm.bind(null, { email, type: otpType }),
    initialState
  );

  useEffect(() => {}, [isResendingOTP]);

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
        {state.errorMessage && <p>{state.errorMessage}</p>}
        {resendErrorMessage && <p>{resendErrorMessage}</p>}
        <div>
          {(!state.errorMessage || !resendErrorMessage) && (
            <label>OTP has been sent to your email</label>
          )}
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

      <div>
        <p>Didn't get code? </p>
        <button onClick={handleResend}>
          {isResendingOTP ? <Spinner /> : "Resend"}
        </button>
      </div>
    </div>
  );
};
