"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const EMPTY = {
  name: "",
  role: "",
  jenjang: "",
  bio: "",
  mapel: "",
  photo_url: "",
  active: true,
};

export default function AdminTutors() {
  const supabase = createClient();
  const [tutors, setTutors] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");
  const fileRef = useRef();

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("tutors")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Load tutors error:", error);
      showToast("Gagal memuat tutor: " + error.message);
      setTutors([]);
    } else {
      setTutors(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function uploadPhoto(file) {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `tutors/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("trinity-assets")
      .upload(path, file);
    if (error) {
      alert("Upload gagal: " + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("trinity-assets").getPublicUrl(path);
    setForm((f) => ({ ...f, photo_url: data.publicUrl }));
    setUploading(false);
  }

  async function handleSave() {
    if (!form.name || !form.role) return alert("Nama dan jabatan wajib diisi.");
    setSaving(true);
    const payload = {
      ...form,
      mapel: form.mapel
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    let result;
    if (editId) {
      result = await supabase.from("tutors").update(payload).eq("id", editId);
    } else {
      result = await supabase.from("tutors").insert(payload);
    }
    if (result.error) {
      console.error("Save tutor error:", result.error);
      showToast("Gagal menyimpan tutor: " + result.error.message);
      setSaving(false);
      return;
    }
    showToast(
      editId ? "Tutor berhasil diperbarui." : "Tutor berhasil ditambahkan.",
    );
    setSaving(false);
    setForm(EMPTY);
    setEditId(null);
    setShowForm(false);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Hapus tutor ini?")) return;
    const { error } = await supabase.from("tutors").delete().eq("id", id);
    if (error) {
      console.error("Delete tutor error:", error);
      showToast("Gagal menghapus tutor: " + error.message);
      return;
    }
    showToast("Tutor dihapus.");
    load();
  }

  function startEdit(t) {
    setForm({
      ...t,
      mapel: Array.isArray(t.mapel) ? t.mapel.join(", ") : t.mapel,
    });
    setEditId(t.id);
    setShowForm(true);
  }

  return (
    <div style={{ padding: "36px" }}>
      {/* Toast */}
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
            boxShadow: "0 4px 20px rgba(0,0,0,.15)",
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
          marginBottom: 28,
        }}
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
            Kelola Tutor
          </h1>
          <p style={{ color: "var(--gray-600)", fontSize: ".88rem" }}>
            {tutors.length} tutor terdaftar
          </p>
        </div>
        <button
          onClick={() => {
            setForm(EMPTY);
            setEditId(null);
            setShowForm(true);
          }}
          className="btn btn-primary"
          style={{ gap: 8 }}
        >
          + Tambah Tutor
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
              padding: "36px",
              width: "100%",
              maxWidth: 560,
              maxHeight: "90vh",
              overflowY: "auto",
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
              {editId ? "Edit Tutor" : "Tambah Tutor Baru"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Photo upload */}
              <div>
                <label style={L}>Foto Tutor</label>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 12,
                      background: "var(--blue-pale)",
                      overflow: "hidden",
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    {form.photo_url ? (
                      <Image
                        src={form.photo_url}
                        alt="preview"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--blue)",
                          opacity: 0.4,
                        }}
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      style={{ ...btnSecondary, marginBottom: 6 }}
                    >
                      {uploading ? "Mengupload..." : "Pilih Foto"}
                    </button>
                    <p style={{ fontSize: ".75rem", color: "var(--gray-400)" }}>
                      JPG atau PNG, maks 2MB
                    </p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        e.target.files[0] && uploadPhoto(e.target.files[0])
                      }
                    />
                  </div>
                </div>
              </div>

              <Row>
                <Field
                  label="Nama Lengkap *"
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                />
                <Field
                  label="Jabatan / Role *"
                  value={form.role}
                  onChange={(v) => setForm((f) => ({ ...f, role: v }))}
                  placeholder="Tutor Matematika & Fisika"
                />
              </Row>
              <Row>
                <Field
                  label="Jenjang"
                  value={form.jenjang}
                  onChange={(v) => setForm((f) => ({ ...f, jenjang: v }))}
                  placeholder="SMP – SMA"
                />
                <Field
                  label="Mata Pelajaran"
                  value={form.mapel}
                  onChange={(v) => setForm((f) => ({ ...f, mapel: v }))}
                  placeholder="Matematika, Fisika, Kimia"
                />
              </Row>
              <div>
                <label style={L}>Bio / Deskripsi</label>
                <textarea
                  value={form.bio}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bio: e.target.value }))
                  }
                  rows={4}
                  placeholder="Latar belakang dan keahlian tutor..."
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="checkbox"
                  id="active"
                  checked={form.active}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, active: e.target.checked }))
                  }
                  style={{ width: 16, height: 16 }}
                />
                <label
                  htmlFor="active"
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
                marginTop: 28,
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setShowForm(false);
                  setForm(EMPTY);
                  setEditId(null);
                }}
                style={btnSecondary}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary"
              >
                {saving
                  ? "Menyimpan..."
                  : editId
                    ? "Simpan Perubahan"
                    : "Tambah Tutor"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        style={{
          background: "white",
          borderRadius: "var(--radius)",
          border: "1px solid var(--gray-200)",
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "var(--gray-400)",
            }}
          >
            Memuat data...
          </div>
        ) : tutors.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "var(--gray-400)",
            }}
          >
            Belum ada tutor. Tambahkan tutor pertama.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: ".87rem",
            }}
          >
            <thead>
              <tr style={{ background: "var(--gray-100)" }}>
                {[
                  "Foto",
                  "Nama & Role",
                  "Jenjang",
                  "Mapel",
                  "Status",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 18px",
                      textAlign: "left",
                      color: "var(--gray-600)",
                      fontWeight: 600,
                      fontSize: ".76rem",
                      letterSpacing: ".04em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tutors.map((t, i) => (
                <tr
                  key={t.id}
                  style={{
                    borderTop: "1px solid var(--gray-200)",
                    background: i % 2 === 0 ? "white" : "var(--off-white)",
                  }}
                >
                  <td style={{ padding: "12px 18px" }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        background: "var(--blue-pale)",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {t.photo_url && (
                        <Image
                          src={t.photo_url}
                          alt={t.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <div style={{ fontWeight: 700, color: "var(--navy)" }}>
                      {t.name}
                    </div>
                    <div
                      style={{ fontSize: ".78rem", color: "var(--gray-400)" }}
                    >
                      {t.role}
                    </div>
                  </td>
                  <td
                    style={{ padding: "12px 18px", color: "var(--gray-600)" }}
                  >
                    {t.jenjang ?? "–"}
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {(Array.isArray(t.mapel) ? t.mapel : [])
                        .slice(0, 3)
                        .map((m, j) => (
                          <span
                            key={j}
                            style={{
                              fontSize: ".72rem",
                              padding: "2px 8px",
                              borderRadius: 50,
                              background: "var(--blue-pale)",
                              color: "var(--blue)",
                              fontWeight: 600,
                            }}
                          >
                            {m}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <span
                      style={{
                        fontSize: ".75rem",
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 50,
                        background: t.active ? "#d1fae5" : "#fee2e2",
                        color: t.active ? "#059669" : "#dc2626",
                      }}
                    >
                      {t.active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => startEdit(t)}
                        style={{
                          ...btnSmall,
                          background: "var(--blue-pale)",
                          color: "var(--blue)",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        style={{
                          ...btnSmall,
                          background: "#fee2e2",
                          color: "#dc2626",
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Row({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {children}
    </div>
  );
}
function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label style={L}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
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
const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 9,
  border: "1.5px solid var(--gray-200)",
  fontSize: ".9rem",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};
const btnSecondary = {
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
const btnSmall = {
  padding: "6px 14px",
  borderRadius: 6,
  border: "none",
  fontWeight: 600,
  fontSize: ".78rem",
  cursor: "pointer",
  fontFamily: "inherit",
};
