"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginAdmin(_prevState, formData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createClient();

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    return { error: "Email atau password salah. Coba lagi." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    await supabase.auth.signOut();
    return { error: "Login berhasil, tetapi sesi belum terbaca. Coba masuk lagi." };
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

  if (adminError) {
    console.error("Failed to verify admin user:", {
      message: adminError.message,
      code: adminError.code,
      details: adminError.details,
      hint: adminError.hint,
    });
    await supabase.auth.signOut();
    return { error: "Login berhasil, tetapi akses admin belum bisa diverifikasi." };
  }

  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "Akun ini belum diberi akses admin." };
  }

  redirect("/admin/dashboard");
}
