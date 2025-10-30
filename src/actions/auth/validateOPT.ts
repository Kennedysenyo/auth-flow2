"use server";

import { isCorrectFormat } from "@/utils/format-checkor";
import { verifyOTP } from "./verify-otp";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis/redis";

type OTPFormErrors = {
  otp?: string;
};

export type OTPFormState = {
  errors: OTPFormErrors;
  success: boolean;
  errorMessage: string | null;
};

export const validateOTPForm = async (
  { email, type }: { email: string; type: "signup" | "recovery" },
  prevState: OTPFormState,
  formData: FormData
): Promise<OTPFormState> => {
  const otp = formData.get("otp") as string;

  const inputError: OTPFormErrors = {};

  if (!otp) {
    inputError.otp = "Enter the OTP code";
  } else if (isNaN(Number(otp))) {
    inputError.otp = "Invalid token";
  }

  if (Object.keys(inputError).length > 0) {
    return { errors: inputError, success: false, errorMessage: null };
  }

  if (!isCorrectFormat("email", email)) {
    return {
      errors: {},
      success: false,
      errorMessage: "Error! restart signup process",
    };
  }

  const errorMessage = await verifyOTP(type, email, otp);
  if (errorMessage) {
    return { errors: {}, success: false, errorMessage };
  }

  if (type === "signup") {
    const cookieStore = await cookies();
    if (cookieStore.has("signup")) {
      const signupToken = cookieStore.get("signup")?.value;
      await redis.del(`signup_token: ${signupToken}`);
      cookieStore.delete("signup");
    }
  }

  return { errors: {}, success: true, errorMessage: null };
};
