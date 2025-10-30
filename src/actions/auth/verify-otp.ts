"use server";

import { createClient } from "@/auth/server";
import { isCorrectFormat } from "@/utils/format-checkor";
import { handleError } from "@/utils/handle-errors";

export const verifyOTP = async (
  type: "signup" | "recovery",
  email: string,
  token: string
): Promise<string | null> => {
  try {
    if (!isCorrectFormat("email", email)) {
      throw new Error("Invalid email");
    }
    const { auth } = await createClient();
    const { data, error } = await auth.verifyOtp({
      type,
      email,
      token,
    });

    if (error || !data) {
      throw error ?? new Error("Error! token expired");
    }

    // const emailSendingError = await sendWelcomeEmial(email, "John Kennedy");
    // if (emailSendingError) {
    //   console.error("Welcome Email Send Fail.", emailSendingError);
    // }
    return null;
  } catch (error) {
    return handleError(error);
  }
};
