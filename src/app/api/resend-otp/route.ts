"use server";

import { createAdminClient } from "@/auth/server";
import { redis } from "@/lib/redis/redis";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { isCorrectFormat } from "@/utils/format-checkor";
import { parse } from "path";

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1h"),
});

export const POST = async (request: NextRequest) => {
  const { email, token, type } = await request.json();

  const { auth } = await createAdminClient();

  if (!isCorrectFormat("email", email)) {
    return NextResponse.json(
      {
        error: { message: "Invalid Email" },
      },
      { status: 400 }
    );
  }

  if (!type) {
    return NextResponse.json(
      {
        error: { message: "Invalid request type" },
      },
      { status: 400 }
    );
  }

  const { success } = await rateLimit.limit(email);
  if (!success) {
    return NextResponse.json(
      { error: { message: "To many attempts, wait for a while" } },
      { status: 429 }
    );
  }

  try {
    if (type === "signup") {
      const tokenData: string | null = await redis.get(`signup_token:${token}`);

      if (!tokenData) {
        return NextResponse.json(
          {
            error: { message: "Expired or Invalid token" },
          },
          { status: 400 }
        );
      }

      let parsedData: { email: string; hashedPassword: string };
      try {
        parsedData =
          typeof tokenData === "object" ? tokenData : JSON.parse(tokenData);
        if (!parsedData?.hashedPassword) {
          throw new Error("Missing hashed password");
        }
      } catch (error: unknown) {
        return NextResponse.json(
          {
            error: { message: "Missing hashed password" },
          },
          { status: 400 }
        );
      }

      // Generate signup link
      const { data: verificationData, error: signupError } =
        await auth.admin.generateLink({
          type: "signup",
          email,
          password: parsedData.hashedPassword,
        });

      if (!verificationData || signupError) {
        return NextResponse.json(
          { error: { message: "Failed to generate signup OTP" } },
          { status: 400 }
        );
      }
      console.log("Signup OTP: ", verificationData.properties?.email_otp);

      // TODO: Send otp vai emial
    } else {
      const { data, error: recoveryError } = await auth.admin.generateLink({
        type: "recovery",
        email,
      });

      if (!data || recoveryError) {
        console.error("Recovery OTP failed:", recoveryError?.message);
        return NextResponse.json(
          { error: { message: "Failed to generate recovery OTP" } },
          { status: 400 }
        );
      }

      console.log("Recovery OTP:", data.properties.email_otp);
      // TODO: Send email with OTP
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("OTP generate error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
};
