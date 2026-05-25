"use client";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { withQueryTimeout } from "@/lib/supabase/query";

const EMPTY = { name: "", role: "", text: "", rating: 5, active: true };

export default function AdminTestimonials() {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");

  async function load(options = {}) {
    if (options.withLoading) setLoading(true);
    try {
      const { data, error } = await withQueryTimeout(
        supabase
          .from("testimonials")
          .select("*")
          .order("created_at", { ascending: false }),
        "Data testimoni",
      );
      if (error) {
        console.error("Load testimonials error:", error);
        showToast("Gagal memuat testimoni: " + error.message);
        setItems([]);
      } else {
        setItems(data ?? []);
      }
    } catch (error) {
      console.error("Load testimonials timeout:", error);
      showToast("Gagal memuat testimoni: " + error.message);
      setItems([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;

    async function loadTestimonials() {
      try {
        const { data, error } = await withQueryTimeout(
          supabase
            .from("testimonials")
            .select("*")
            .order("created_at", { ascending: false }),
          "Data testimoni",
        );
        if (!mounted) return;

        if (error) {
          console.error("Load testimonials error:", error);
          setToast("Gagal memuat testimoni: " + error.message);
          setTimeout(() => setToast(""), 3000);
          setItems([]);
        } else {
          setItems(data ?? []);
        }
      } catch (error) {
        if (!mounted) return;
        console.error("Load testimonials timeout:", error);
        setToast("Gagal memuat testimoni: " + error.message);
        setTimeout(() => setToast(""), 3000);
        setItems([]);
      }
      setLoading(false);
    }

    loadTestimonials();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function handleSave() {
    if (!form.name || !form.text)
      return alert("Nama dan isi testimoni wajib diisi.");
    setSaving(true);
    const result = editId
      ? await supabase.from("testimonials").update(form).eq("id", editId)
      : await supabase.from("testimonials").insert(form);
    if (result.error) {
      console.error("Save testimonials error:", result.error);
      showToast("Gagal menyimpan testimoni: " + result.error.message);
      setSaving(false);
      return;
    }
    showToast(editId ? "Testimoni diperbarui." : "Testimoni ditambahkan.");
    setSaving(false);
    setForm(EMPTY);
    setEditId(null);
    setShowForm(false);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Hapus testimoni ini?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      console.error("Delete testimonials error:", error);
      showToast("Gagal menghapus testimoni: " + error.message);
      return;
    }
    showToast("Testimoni dihapus.");
    load();
  }

  return (
    <div className="admin-page px-4 sm:px-6 lg:px-9 py-6">
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            background: "#10b981",
            color: "white",
            padding: "12px 20px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: ".88rem",
            zIndex: 999,
          }}
        >
          {toast}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
        className="admin-page-header"
      >
        <div>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "1.8rem",
              color: "var(--navy)",
              marginBottom: 4,
            }}
          >
            Kelola Testimoni
          </h1>
          <p style={{ color: "var(--gray-600)", fontSize: ".88rem" }}>
            {items.length} testimoni terdaftar
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setForm(EMPTY);
            setEditId(null);
            setShowForm(true);
          }}
          className="btn btn-primary admin-page-action"
        >
          + Tambah Testimoni
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
            zIndex: 100,
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
              padding: 36,
              width: "100%",
              maxWidth: 500,
              boxShadow: "0 24px 60px rgba(0,0,0,.25)",
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "1.35rem",
                color: "var(--navy)",
                marginBottom: 24,
              }}
            >
              {editId ? "Edit Testimoni" : "Tambah Testimoni"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label style={L}>Nama *</label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Ibu Sari"
                    style={IS}
                  />
                </div>
                <div>
                  <label style={L}>Role / Keterangan</label>
                  <input
                    value={form.role}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, role: e.target.value }))
                    }
                    placeholder="Orang Tua Siswa SD"
                    style={IS}
                  />
                </div>
              </div>
              <div>
                <label style={L}>Isi Testimoni *</label>
                <textarea
                  value={form.text}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, text: e.target.value }))
                  }
                  rows={4}
                  placeholder="Tulis testimoni di sini..."
                  style={{ ...IS, resize: "vertical" }}
                />
              </div>
              <div>
                <label style={L}>Rating</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, rating: n }))}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        border: `2px solid ${form.rating >= n ? "#c9920a" : "var(--gray-200)"}`,
                        background: form.rating >= n ? "#fdf6e3" : "white",
                        color: form.rating >= n ? "#c9920a" : "var(--gray-400)",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: ".9rem",
                        fontFamily: "inherit",
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="checkbox"
                  id="tactive"
                  checked={form.active}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, active: e.target.checked }))
                  }
                  style={{ width: 16, height: 16 }}
                />
                <label
                  htmlFor="tactive"
                  style={{
                    fontSize: ".88rem",
                    fontWeight: 600,
                    color: "var(--gray-800)",
                    cursor: "pointer",
                  }}
                >
                  Tampilkan di website
                </label>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 24,
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setShowForm(false);
                  setForm(EMPTY);
                  setEditId(null);
                }}
                style={btnSec}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary"
              >
                {saving ? "Menyimpan..." : editId ? "Simpan" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cards grid */}
      {loading ? (
        <div
          style={{ textAlign: "center", padding: 48, color: "var(--gray-400)" }}
        >
          Memuat data...
        </div>
      ) : items.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: 48, color: "var(--gray-400)" }}
        >
          Belum ada testimoni.
        </div>
      ) : (
        <div
          className="admin-card-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 18,
          }}
        >
          {items.map((t) => (
            <div
              key={t.id}
              style={{
                background: "white",
                borderRadius: "var(--radius)",
                border: "1px solid var(--gray-200)",
                padding: 22,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", gap: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill={i < t.rating ? "#c9920a" : "#e5e7eb"}
                      stroke={i < t.rating ? "#c9920a" : "#e5e7eb"}
                      strokeWidth="1"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span
                  style={{
                    fontSize: ".72rem",
                    fontWeight: 700,
                    padding: "3px 9px",
                    borderRadius: 50,
                    background: t.active ? "#d1fae5" : "#fee2e2",
                    color: t.active ? "#059669" : "#dc2626",
                  }}
                >
                  {t.active ? "Aktif" : "Nonaktif"}
                </span>
              </div>
              <p
                style={{
                  fontSize: ".88rem",
                  color: "var(--gray-700)",
                  fontStyle: "italic",
                  lineHeight: 1.65,
                  marginBottom: 14,
                }}
              >
                {`"${t.text}"`}
              </p>
              <div
                style={{
                  borderTop: "1px solid var(--gray-200)",
                  paddingTop: 12,
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: ".88rem",
                    color: "var(--navy)",
                  }}
                >
                  {t.name}
                </p>
                <p
                  style={{
                    fontSize: ".76rem",
                    color: "var(--gray-400)",
                    marginBottom: 12,
                  }}
                >
                  {t.role}
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => {
                      setForm({
                        name: t.name,
                        role: t.role,
                        text: t.text,
                        rating: t.rating,
                        active: t.active,
                      });
                      setEditId(t.id);
                      setShowForm(true);
                    }}
                    style={{
                      ...btnSm,
                      background: "var(--blue-pale)",
                      color: "var(--blue)",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    style={{
                      ...btnSm,
                      background: "#fee2e2",
                      color: "#dc2626",
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const L = {
  display: "block",
  fontSize: ".83rem",
  fontWeight: 600,
  color: "var(--gray-800)",
  marginBottom: 6,
};
const IS = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 9,
  border: "1.5px solid var(--gray-200)",
  fontSize: ".9rem",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};
const btnSec = {
  padding: "10px 20px",
  borderRadius: 50,
  border: "1.5px solid var(--gray-200)",
  background: "white",
  color: "var(--gray-600)",
  fontWeight: 600,
  fontSize: ".88rem",
  cursor: "pointer",
  fontFamily: "inherit",
};
const btnSm = {
  padding: "6px 14px",
  borderRadius: 6,
  border: "none",
  fontWeight: 600,
  fontSize: ".78rem",
  cursor: "pointer",
  fontFamily: "inherit",
};
