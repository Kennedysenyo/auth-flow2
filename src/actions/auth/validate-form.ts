"use server";

import { redis } from "@/lib/redis/redis";
import { isCorrectFormat } from "@/utils/format-checkor";
import { hash } from "bcryptjs";
import { cookies } from "next/headers";
import { loginAction } from "./login";
import { generateOTP } from "./generate-otp";

type MissingFields = {
  email?: string;
  password?: string;
  cnfmPassword?: string;
};

export type FormState = {
  inputErrors: MissingFields;
  success: boolean;
  errorMessage: string | null;
};

export const validateForm = async (
  isLogin: boolean,
  prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const cnfmPassword = !isLogin
    ? (formData.get("cnfm-password") as string)
    : undefined;

  const inputErrors: MissingFields = {};

  if (!email) {
    inputErrors.email = "Email is required!";
  } else if (!isCorrectFormat("email", email)) {
    inputErrors.email = "Enter a valid email!";
  }

  if (!password) {
    inputErrors.password = "Password is required!";
  } else if (!isCorrectFormat("password", password)) {
    inputErrors.password =
      "at least, 1 uppercase, 1 lowercase, special chars, in 8 chars minimum";
  }

  if (!isLogin) {
    if (!cnfmPassword) inputErrors.cnfmPassword = "Password is required!";
    else if (password !== cnfmPassword) {
      inputErrors.cnfmPassword = "Passwords do not match";
    }
  }

  if (Object.keys(inputErrors).length > 0) {
    return { inputErrors, success: false, errorMessage: null };
  }

  console.log(email, password);

  // Login / Signup
  const errorMessage = isLogin
    ? await loginAction(email, password)
    : await generateOTP("signup", email, password);
  if (errorMessage) {
    return { inputErrors: {}, success: false, errorMessage };
  }

  if (!isLogin) {
    const hashedPassword = await hash(password, 10);

    const token = crypto.randomUUID();
    console.log("The redis token is, ", token);
    await redis.set(
      `signup_token:${token}`,
      JSON.stringify({ email, hashedPassword }),
      { ex: 15 * 60 }
    );

    const cookieStore = await cookies();
    cookieStore.set("signup", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    cookieStore.set("email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });
  }

  return { inputErrors: {}, success: true, errorMessage: null };
};
