"use client";

import { useActionState } from "react";
import Image from "next/image";
import { loginAdmin } from "./actions";

const initialState = {
  error: "",
};

export default function AdminLogin() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--navy)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "var(--radius-lg)",
          padding: "48px 40px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 24px 60px rgba(0,0,0,.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <Image
              src="/images/logo-clean.png"
              alt="Trinity Academy Logo"
              width={46}
              height={46}
              priority
              style={{
                width: 46,
                height: 46,
                objectFit: "contain",
                flexShrink: 0,
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 4,
                lineHeight: 1,
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "1.55rem",
                  color: "var(--navy)",
                }}
              >
                Trinity
              </span>

              <em
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "1.35rem",
                  color: "#c9920a",
                  fontStyle: "italic",
                }}
              >
                Academy
              </em>
            </div>
          </div>

          <p
            style={{
              fontSize: ".9rem",
              color: "var(--gray-600)",
              fontWeight: 600,
              margin: 0,
            }}
          >
            Admin Panel
          </p>
        </div>

        <form
          action={formAction}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          <div>
            <label style={labelStyle}>Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="admin@trinityacademy.id"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="********"
              style={inputStyle}
            />
          </div>

          {state.error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: ".85rem",
                color: "#dc2626",
              }}
            >
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            style={{
              background: "var(--blue)",
              color: "white",
              border: "none",
              borderRadius: 50,
              padding: "14px",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: pending ? "not-allowed" : "pointer",
              opacity: pending ? 0.7 : 1,
              transition: "all .2s",
              marginTop: 4,
              fontFamily: "inherit",
            }}
          >
            {pending ? "Masuk..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: ".8rem",
            color: "var(--gray-400)",
          }}
        >
          Akses terbatas untuk tim Trinity Academy
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: ".85rem",
  fontWeight: 600,
  color: "var(--gray-800)",
  marginBottom: 6,
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 10,
  border: "1.5px solid var(--gray-200)",
  fontSize: ".95rem",
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color .2s",
  boxSizing: "border-box",
};
