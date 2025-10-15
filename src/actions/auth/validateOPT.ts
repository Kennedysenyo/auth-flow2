type OTPFormErrors = {
  otp?: string;
};

export type OTPFormState = {
  errors: OTPFormErrors;
  success: boolean;
  errorMessage: string | null;
};

export const validateOTPForm = async (
  { email, signupToken }: { email: string; signupToken: string | undefined },
  prevState: OTPFormState,
  formData: FormData
): Promise<OTPFormState> => {
  const otp = formData.get("otp") as string;

  const inputError: OTPFormErrors = {};

  if (!otp) inputError.otp = "Enter the OTP code";

  if (Object.keys(inputError).length > 0)
    return { errors: inputError, success: false, errorMessage: null };

  // const errorMessage = await VerifyOTP(otp) ?
  return { errors: {}, success: true, errorMessage: null };
};
