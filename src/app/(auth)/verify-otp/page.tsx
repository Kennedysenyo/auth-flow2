import { OtpForm } from "@/components/auth/otp/OtpForm";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function verifyOTP() {
  const cookiesStore = await cookies();
  const email = cookiesStore.get("email")?.value;
  const signupToken = cookiesStore.get("signup_token")?.value;

  if (!email && !signupToken) redirect("/sign-up");
  if (!email) redirect("/login");

  return (
    <div>
      <OtpForm email={email} signupToken={signupToken} />
    </div>
  );
}
