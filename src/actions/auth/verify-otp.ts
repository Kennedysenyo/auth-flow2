"use server";

export const verifyOTP = async (
  type: "signup" | "recovery",
  email: string,
  token?: string
): Promise<string | null> => {
  return null;
};
