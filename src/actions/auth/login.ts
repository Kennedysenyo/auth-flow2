import { createClient } from "@/auth/server";
import { handleError } from "@/utils/handle-errors";
import { handleClientScriptLoad } from "next/script";

export const loginAction = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
    const { auth } = await createClient();
    const { error } = await auth.signInWithPassword({ email, password });
    if (error) throw error;
    return null;
  } catch (error) {
    return handleError(error);
  }
};
