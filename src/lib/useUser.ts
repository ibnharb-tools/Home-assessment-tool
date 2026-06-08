"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "./supabase";

/**
 * Tracks the current Supabase auth user. `loading` is true until the initial
 * session check resolves. When Supabase isn't configured, resolves to a null
 * user (not loading) so gated pages can show a configuration message.
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  // When Supabase isn't configured there's nothing to load, so start resolved.
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth
      .getSession()
      .then(({ data }) => setUser(data.session?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, loading, configured: isSupabaseConfigured };
}
