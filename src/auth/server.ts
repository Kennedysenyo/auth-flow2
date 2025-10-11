import { handleError } from "@/utils/handle-errors";
import { createServerClient } from "@supabase/ssr";
import { createClient as createNewClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const client = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  return client;
}

export const getUser = async () => {
  try {
    const { auth } = await createClient();
    const { data, error } = await auth.getUser();

    if (!data && error) {
      throw error;
    }
    return data.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    console.error(error as string);
    return null;
  }
};

export const createAdminClient = async () => {
  return createNewClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SRK!);
};
