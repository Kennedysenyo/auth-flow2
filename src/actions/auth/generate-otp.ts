"use server";

import { createAdminClient } from "@/auth/server";
import { handleError } from "@/utils/handle-errors";

export const generateOTP = async (
  type: "signup" | "recovery",
  email: string,
  password: string
): Promise<string | null> => {
  try {
    const { auth } = await createAdminClient();

    if (type === "signup") {
      if (!password) {
        throw new Error("Password required for sign up token generation");
      }

      const { data, error } = await auth.admin.generateLink({
        type: "signup",
        email,
        password,
      });

      if (error && !data) {
        throw new Error(error.message || "OTP generation failed");
      }

      const otp = data.properties?.email_otp;
      console.log("Signup_otp: ", otp);
      // TO-DO: Send OTP to Email

      return null;
    }

    const { data, error } = await auth.admin.generateLink({
      type: "recovery",
      email,
    });

    if (!data && error) {
      throw error;
    }

    const otp = data.properties?.email_otp;
    console.log("Recovery otp: ", otp);
    // Forward to email

    return null;
  } catch (error) {
    return handleError(error);
  }
};
