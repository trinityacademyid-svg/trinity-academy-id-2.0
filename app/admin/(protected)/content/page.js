"use client";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  DEFAULT_FOUNDERS,
  DEFAULT_ONLINE_PROGRAMS,
  DEFAULT_PRIVATE_PROGRAMS,
  DEFAULT_SIGNATURE_PROGRAMS,
  DEFAULT_WHY_ONLINE,
  DEFAULT_WHY_PRIVATE,
} from "@/lib/content-defaults";

const JSON_DEFAULTS = {
  founders: DEFAULT_FOUNDERS,
  program_private_items: DEFAULT_PRIVATE_PROGRAMS,
  program_online_items: DEFAULT_ONLINE_PROGRAMS,
  program_private_benefits: DEFAULT_WHY_PRIVATE,
  program_online_benefits: DEFAULT_WHY_ONLINE,
  signature_programs: DEFAULT_SIGNATURE_PROGRAMS,
};

const SECTIONS = [
  {
    key: "hero_title",
    label: "Hero — Judul Utama",
    type: "text",
    hint: "Judul besar di halaman home",
  },
  {
    key: "hero_subtitle",
    label: "Hero — Subjudul",
    type: "textarea",
    hint: "Deskripsi singkat di bawah judul",
  },
  {
    key: "about_story",
    label: "About — Cerita Trinity",
    type: "textarea",
    hint: "Paragraf latar belakang berdirinya Trinity",
  },
  {
    key: "about_vision",
    label: "About — Visi",
    type: "textarea",
    hint: "Pernyataan visi Trinity Academy",
  },
  {
    key: "about_mission",
    label: "About — Misi",
    type: "textarea",
    hint: "Pernyataan misi Trinity Academy",
  },
  {
    key: "wa_number",
    label: "Nomor WhatsApp",
    type: "text",
    hint: "Format: 628xxxxxxxxxx (tanpa + atau 0)",
  },
  {
    key: "email",
    label: "Email Kontak",
    type: "text",
    hint: "Contoh: info@trinityacademy.id",
  },
  {
    key: "address",
    label: "Alamat",
    type: "text",
    hint: "Alamat kantor Trinity Academy",
  },
  {
    key: "office_hours",
    label: "Jam Operasional",
    type: "text",
    hint: "Contoh: Senin–Sabtu, 08.00–20.00 WIT",
  },
  {
    key: "stat_tutors",
    label: "Statistik — Jumlah Tutor",
    type: "text",
    hint: "Contoh: 50+",
  },
  {
    key: "stat_students",
    label: "Statistik — Jumlah Siswa",
    type: "text",
    hint: "Contoh: 300+",
  },
  {
    key: "stat_rating",
    label: "Statistik — Rating",
    type: "text",
    hint: "Contoh: 4.9",
  },
  {
    key: "stat_years",
    label: "Statistik — Tahun Berdiri",
    type: "text",
    hint: "Contoh: 3+",
  },
];

const CONTENT_CATEGORIES = [
  {
    id: "home",
    title: "Halaman Home",
    description: "Hero dan angka statistik utama di halaman depan.",
    type: "fields",
    keys: [
      "hero_title",
      "hero_subtitle",
      "stat_tutors",
      "stat_students",
      "stat_rating",
      "stat_years",
    ],
  },
  {
    id: "about",
    title: "Halaman About Us",
    description: "Cerita, visi, dan misi Trinity Academy.",
    type: "fields",
    keys: ["about_story", "about_vision", "about_mission"],
  },
  {
    id: "contact",
    title: "Informasi Kontak",
    description: "WhatsApp, email, alamat, dan jam operasional.",
    type: "fields",
    keys: ["wa_number", "email", "address", "office_hours"],
  },
  {
    id: "founders",
    title: "Founder",
    description:
      "Nama, jabatan, foto, bio, dan tautan founder yang tampil di halaman About Us.",
    type: "list",
    keys: ["founders"],
  },
  {
    id: "private-programs",
    title: "Program Les Private",
    description:
      "Daftar program yang tampil di halaman Program dan preview homepage.",
    type: "list",
    keys: ["program_private_items"],
  },
  {
    id: "private-benefits",
    title: "Benefit Les Private",
    description: "Poin keunggulan di sidebar program private.",
    type: "list",
    keys: ["program_private_benefits"],
  },
  {
    id: "online-programs",
    title: "Program Les Online",
    description:
      "Daftar program online yang tampil di halaman Program dan preview homepage.",
    type: "list",
    keys: ["program_online_items"],
  },
  {
    id: "online-benefits",
    title: "Benefit Les Online",
    description: "Poin keunggulan di sidebar program online.",
    type: "list",
    keys: ["program_online_benefits"],
  },
  {
    id: "signature-programs",
    title: "Signature Programs",
    description:
      "Program unggulan yang tampil di halaman Signature dan preview homepage.",
    type: "list",
    keys: ["signature_programs"],
  },
];

export default function AdminContent() {
  const supabase = useMemo(() => createClient(), []);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingTarget, setSavingTarget] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(
    CONTENT_CATEGORIES[0].id,
  );
  const [toast, setToast] = useState("");

  const activeCategory =
    CONTENT_CATEGORIES.find((category) => category.id === activeCategoryId) ??
    CONTENT_CATEGORIES[0];

  useEffect(() => {
    let mounted = true;

    async function loadContent() {
      const { data, error } = await supabase.from("site_content").select("*");
      if (!mounted) return;

      if (error) {
        console.error("Load site content error:", error);
        setToast("Gagal memuat konten: " + error.message);
        setTimeout(() => setToast(""), 3000);
        setContent({});
      } else {
        const map = {};
        (data ?? []).forEach((row) => {
          map[row.key] = row.value;
        });
        Object.entries(JSON_DEFAULTS).forEach(([key, value]) => {
          if (!map[key]) {
            map[key] = JSON.stringify(value, null, 2);
          }
        });
        setContent(map);
      }
      setLoading(false);
    }

    loadContent();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function saveKeys(keys, successMessage, target = "category") {
    setSavingTarget(target);
    const upserts = keys.map((key) => ({
      key,
      value: content[key] ?? "",
    }));
    const { error } = await supabase
      .from("site_content")
      .upsert(upserts, { onConflict: "key" });
    setSavingTarget("");
    if (error) {
      console.error("Save site content error:", error);
      showToast("Gagal menyimpan konten: " + error.message);
    } else {
      showToast(successMessage);
    }
  }

  async function handleSaveAll() {
    await saveKeys(
      Object.keys(content),
      "Semua perubahan dari semua kategori berhasil disimpan!",
      "all",
    );
  }

  async function handleSaveCategory(category = activeCategory) {
    await saveKeys(
      category.keys,
      `${category.title} berhasil disimpan!`,
      category.id,
    );
  }

  function parseJsonList(key) {
    try {
      const parsed = JSON.parse(content[key] || "[]");
      return Array.isArray(parsed) ? parsed : (JSON_DEFAULTS[key] ?? []);
    } catch (error) {
      console.error(`Invalid JSON for ${key}:`, error);
      return JSON_DEFAULTS[key] ?? [];
    }
  }

  function setJsonList(key, list) {
    setContent((current) => ({
      ...current,
      [key]: JSON.stringify(list, null, 2),
    }));
  }

  function updateJsonItem(key, index, field, value, mode = "text") {
    const list = parseJsonList(key);
    const next = [...list];
    next[index] = {
      ...next[index],
      [field]:
        mode === "list"
          ? value
              .split(/\r?\n|,/)
              .map((item) => item.trim())
              .filter(Boolean)
          : value,
    };
    setJsonList(key, next);
  }

  function addJsonItem(key, template) {
    setJsonList(key, [...parseJsonList(key), template]);
  }

  function removeJsonItem(key, index) {
    setJsonList(
      key,
      parseJsonList(key).filter((_, itemIndex) => itemIndex !== index),
    );
  }

  async function uploadFounderPhoto(index, file) {
    const ext = file.name.split(".").pop();
    const path = `founders/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("trinity-assets")
      .upload(path, file);

    if (error) {
      console.error("Upload founder photo error:", error);
      showToast("Upload foto gagal: " + error.message);
      return;
    }

    const { data } = supabase.storage.from("trinity-assets").getPublicUrl(path);
    updateJsonItem("founders", index, "photo_url", data.publicUrl);
    showToast("Foto founder berhasil diupload.");
  }

  if (loading)
    return (
      <div
        style={{ padding: 48, textAlign: "center", color: "var(--gray-400)" }}
      >
        Memuat konten...
      </div>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
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
          gap: 18,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
        className="sm:flex-row"
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
            Edit Konten Website
          </h1>
          <p style={{ color: "var(--gray-600)", fontSize: ".88rem" }}>
            Perubahan akan langsung terlihat di website setelah disimpan.
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={Boolean(savingTarget)}
          className="btn btn-primary btn-lg whitespace-nowrap"
        >
          {savingTarget === "all" ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </button>
      </div>

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          marginBottom: 20,
          padding: "12px 0",
          background: "var(--off-white, #f8fafc)",
        }}
        className="sm:padding-4"
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 4,
          }}
          className="sm:gap-2"
        >
          {CONTENT_CATEGORIES.map((category) => {
            const active = category.id === activeCategory.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategoryId(category.id)}
                style={{
                  ...quickMenuButton,
                  background: active ? "var(--navy)" : "white",
                  color: active ? "white" : "var(--gray-700)",
                  borderColor: active ? "var(--navy)" : "var(--gray-200)",
                  boxShadow: active
                    ? "0 10px 24px rgba(15, 23, 42, .16)"
                    : "none",
                  fontSize: ".75rem",
                  padding: "8px 12px",
                }}
                className="sm:text-sm sm:px-3 sm:py-2"
              >
                {category.title}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
        className="sm:gap-7"
      >
        {activeCategory.type === "fields" && (
          <FieldGroup
            group={activeCategory}
            content={content}
            onChange={(key, value) =>
              setContent((current) => ({ ...current, [key]: value }))
            }
            onSave={() => handleSaveCategory(activeCategory)}
            saving={savingTarget === activeCategory.id}
            disabled={Boolean(savingTarget)}
          />
        )}

        {activeCategory.id === "founders" && (
          <ListEditor
            title="Founder"
            description="Nama, jabatan, foto, bio, dan tautan founder yang tampil di halaman About Us."
            items={parseJsonList("founders")}
            fields={[
              { key: "name", label: "Nama" },
              { key: "role", label: "Jabatan" },
              { key: "photo_url", label: "URL Foto" },
              { key: "bio", label: "Bio", multiline: true },
              { key: "linkedin", label: "LinkedIn" },
            ]}
            onChange={(index, field, value) =>
              updateJsonItem("founders", index, field, value)
            }
            onUploadPhoto={uploadFounderPhoto}
            onAdd={() =>
              addJsonItem("founders", {
                name: "Founder Trinity Academy",
                role: "Founder",
                photo_url: "/images/maskot.png",
                bio: "Profil founder sedang disiapkan.",
                linkedin: "",
              })
            }
            onRemove={(index) => removeJsonItem("founders", index)}
            onSave={() => handleSaveCategory(activeCategory)}
            saving={savingTarget === activeCategory.id}
            disabled={Boolean(savingTarget)}
          />
        )}

        {activeCategory.id === "private-programs" && (
          <ListEditor
            title="Program Les Private"
            description="Daftar program yang tampil di halaman Program dan preview homepage."
            items={parseJsonList("program_private_items")}
            fields={[
              { key: "title", label: "Nama Program" },
              { key: "jenjang", label: "Jenjang" },
              { key: "desc", label: "Deskripsi", multiline: true },
              {
                key: "features",
                label: "Fitur",
                mode: "list",
                multiline: true,
              },
            ]}
            onChange={(index, field, value, mode) =>
              updateJsonItem("program_private_items", index, field, value, mode)
            }
            onAdd={() =>
              addJsonItem("program_private_items", {
                title: "Program Baru",
                jenjang: "Jenjang",
                desc: "Deskripsi program.",
                features: ["Fitur utama"],
              })
            }
            onRemove={(index) => removeJsonItem("program_private_items", index)}
            onSave={() => handleSaveCategory(activeCategory)}
            saving={savingTarget === activeCategory.id}
            disabled={Boolean(savingTarget)}
          />
        )}

        {activeCategory.id === "private-benefits" && (
          <ListEditor
            title="Benefit Les Private"
            description="Poin keunggulan di sidebar program private."
            items={parseJsonList("program_private_benefits")}
            fields={[
              { key: "title", label: "Judul" },
              { key: "desc", label: "Deskripsi", multiline: true },
            ]}
            onChange={(index, field, value) =>
              updateJsonItem("program_private_benefits", index, field, value)
            }
            onAdd={() =>
              addJsonItem("program_private_benefits", {
                title: "Benefit Baru",
                desc: "Deskripsi benefit.",
              })
            }
            onRemove={(index) =>
              removeJsonItem("program_private_benefits", index)
            }
            onSave={() => handleSaveCategory(activeCategory)}
            saving={savingTarget === activeCategory.id}
            disabled={Boolean(savingTarget)}
          />
        )}

        {activeCategory.id === "online-programs" && (
          <ListEditor
            title="Program Les Online"
            description="Daftar program online yang tampil di halaman Program dan preview homepage."
            items={parseJsonList("program_online_items")}
            fields={[
              { key: "title", label: "Nama Program" },
              { key: "jenjang", label: "Jenjang" },
              { key: "desc", label: "Deskripsi", multiline: true },
              {
                key: "features",
                label: "Fitur",
                mode: "list",
                multiline: true,
              },
            ]}
            onChange={(index, field, value, mode) =>
              updateJsonItem("program_online_items", index, field, value, mode)
            }
            onAdd={() =>
              addJsonItem("program_online_items", {
                title: "Program Online Baru",
                jenjang: "Jenjang",
                desc: "Deskripsi program.",
                features: ["Fitur utama"],
              })
            }
            onRemove={(index) => removeJsonItem("program_online_items", index)}
            onSave={() => handleSaveCategory(activeCategory)}
            saving={savingTarget === activeCategory.id}
            disabled={Boolean(savingTarget)}
          />
        )}

        {activeCategory.id === "online-benefits" && (
          <ListEditor
            title="Benefit Les Online"
            description="Poin keunggulan di sidebar program online."
            items={parseJsonList("program_online_benefits")}
            fields={[
              { key: "title", label: "Judul" },
              { key: "desc", label: "Deskripsi", multiline: true },
            ]}
            onChange={(index, field, value) =>
              updateJsonItem("program_online_benefits", index, field, value)
            }
            onAdd={() =>
              addJsonItem("program_online_benefits", {
                title: "Benefit Baru",
                desc: "Deskripsi benefit.",
              })
            }
            onRemove={(index) =>
              removeJsonItem("program_online_benefits", index)
            }
            onSave={() => handleSaveCategory(activeCategory)}
            saving={savingTarget === activeCategory.id}
            disabled={Boolean(savingTarget)}
          />
        )}

        {activeCategory.id === "signature-programs" && (
          <ListEditor
            title="Signature Programs"
            description="Program unggulan yang tampil di halaman Signature dan preview homepage."
            items={parseJsonList("signature_programs")}
            fields={[
              { key: "id", label: "ID Anchor" },
              { key: "number", label: "Nomor" },
              { key: "short", label: "Nama Pendek" },
              { key: "title", label: "Judul" },
              { key: "tagline", label: "Tagline" },
              { key: "desc", label: "Deskripsi", multiline: true },
              { key: "pillars", label: "Pilar", mode: "list", multiline: true },
            ]}
            onChange={(index, field, value, mode) =>
              updateJsonItem("signature_programs", index, field, value, mode)
            }
            onAdd={() =>
              addJsonItem("signature_programs", {
                id: "program-baru",
                number: "04",
                short: "Program Baru",
                title: "Program Baru",
                tagline: "Tagline program",
                desc: "Deskripsi program.",
                pillars: ["Pilar utama"],
              })
            }
            onRemove={(index) => removeJsonItem("signature_programs", index)}
            onSave={() => handleSaveCategory(activeCategory)}
            saving={savingTarget === activeCategory.id}
            disabled={Boolean(savingTarget)}
          />
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-content-fields {
            grid-template-columns: 1fr !important;
          }
          .admin-content-upload {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function FieldGroup({ group, content, onChange, onSave, saving, disabled }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "var(--radius)",
        border: "1px solid var(--gray-200)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--gray-200)",
          background: "var(--off-white)",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.05rem",
            color: "var(--navy)",
          }}
        >
          {group.title}
        </h2>
        <p style={{ fontSize: ".78rem", color: "var(--gray-500)" }}>
          {group.description}
        </p>
      </div>
      <div
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {group.keys.map((key) => {
          const sec = SECTIONS.find((s) => s.key === key);
          if (!sec) return null;
          return (
            <div key={key}>
              <label
                style={{
                  display: "block",
                  fontSize: ".85rem",
                  fontWeight: 700,
                  color: "var(--navy)",
                  marginBottom: 4,
                }}
              >
                {sec.label}
              </label>
              {sec.hint && (
                <p
                  style={{
                    fontSize: ".76rem",
                    color: "var(--gray-400)",
                    marginBottom: 8,
                  }}
                >
                  {sec.hint}
                </p>
              )}
              {sec.type === "textarea" ? (
                <textarea
                  value={content[key] ?? ""}
                  onChange={(e) => onChange(key, e.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 9,
                    border: "1.5px solid var(--gray-200)",
                    fontSize: ".9rem",
                    fontFamily: "inherit",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={content[key] ?? ""}
                  onChange={(e) => onChange(key, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 9,
                    border: "1.5px solid var(--gray-200)",
                    fontSize: ".9rem",
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              )}
            </div>
          );
        })}
        <div style={{ textAlign: "right" }}>
          <button
            type="button"
            onClick={onSave}
            disabled={disabled}
            className="btn btn-primary"
          >
            {saving ? "Menyimpan..." : "Simpan Konten"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ListEditor({
  title,
  description,
  items,
  fields,
  onChange,
  onAdd,
  onRemove,
  onUploadPhoto,
  onSave,
  saving,
  disabled,
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "var(--radius)",
        border: "1px solid var(--gray-200)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--gray-200)",
          background: "var(--off-white)",
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "1.05rem",
              color: "var(--navy)",
              marginBottom: 4,
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: ".78rem", color: "var(--gray-500)" }}>
            {description}
          </p>
        </div>
        <button type="button" onClick={onAdd} style={smallButton}>
          + Tambah
        </button>
      </div>

      <div
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {items.length === 0 ? (
          <div style={{ color: "var(--gray-400)", fontSize: ".88rem" }}>
            Belum ada item. Klik tambah untuk mulai mengisi.
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid var(--gray-200)",
                borderRadius: 12,
                padding: 18,
                background: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <strong style={{ color: "var(--navy)", fontSize: ".9rem" }}>
                  {item.title || item.name || `${title} ${index + 1}`}
                </strong>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  style={{
                    ...smallButton,
                    background: "#fee2e2",
                    color: "#dc2626",
                  }}
                >
                  Hapus
                </button>
              </div>

              <div
                className="admin-content-fields"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 14,
                }}
              >
                {fields.map((field) => {
                  const rawValue = item[field.key] ?? "";
                  const value = Array.isArray(rawValue)
                    ? rawValue.join("\n")
                    : rawValue;
                  const controlStyle = {
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 9,
                    border: "1.5px solid var(--gray-200)",
                    fontSize: ".86rem",
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                  };

                  return (
                    <div
                      key={field.key}
                      style={{
                        gridColumn: field.multiline ? "1 / -1" : "auto",
                        minWidth: 0,
                      }}
                    >
                      <label
                        style={{
                          display: "block",
                          fontSize: ".78rem",
                          fontWeight: 700,
                          color: "var(--gray-700)",
                          marginBottom: 6,
                        }}
                      >
                        {field.label}
                      </label>
                      {field.multiline ? (
                        <textarea
                          value={value}
                          rows={field.mode === "list" ? 3 : 4}
                          onChange={(event) =>
                            onChange(
                              index,
                              field.key,
                              event.target.value,
                              field.mode,
                            )
                          }
                          style={{ ...controlStyle, resize: "vertical" }}
                        />
                      ) : (
                        <input
                          value={value}
                          onChange={(event) =>
                            onChange(
                              index,
                              field.key,
                              event.target.value,
                              field.mode,
                            )
                          }
                          style={controlStyle}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {onUploadPhoto && (
                <div
                  className="admin-content-upload"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: 16,
                    alignItems: "center",
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: "1px solid var(--gray-200)",
                  }}
                >
                  <div
                    aria-label="Preview foto founder"
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      border: "4px solid white",
                      backgroundColor: "var(--blue-pale)",
                      backgroundImage: item.photo_url
                        ? `url("${item.photo_url}")`
                        : "none",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "contain",
                      boxShadow: "0 10px 24px rgba(8, 21, 42, .12)",
                    }}
                  />
                  <div>
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: ".78rem",
                        color: "var(--gray-500)",
                      }}
                    >
                      Preview bulat akan berubah setelah file berhasil diupload.
                      Gunakan foto 1:1 minimal 800x800 px, JPG/PNG/WebP, wajah
                      di tengah, dan sisakan ruang di atas serta sisi kepala.
                    </p>
                    <label style={uploadButton}>
                      Upload Foto Founder
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) onUploadPhoto(index, file);
                          event.target.value = "";
                        }}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div style={{ textAlign: "right" }}>
          <button
            type="button"
            onClick={onSave}
            disabled={disabled}
            className="btn btn-primary"
          >
            {saving ? "Menyimpan..." : "Simpan Konten"}
          </button>
        </div>
      </div>
    </div>
  );
}

const quickMenuButton = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid var(--gray-200)",
  fontWeight: 700,
  fontSize: ".82rem",
  cursor: "pointer",
  fontFamily: "inherit",
  whiteSpace: "nowrap",
  transition: "all .2s",
};

const smallButton = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid var(--gray-200)",
  background: "white",
  color: "var(--blue)",
  fontWeight: 700,
  fontSize: ".8rem",
  cursor: "pointer",
  fontFamily: "inherit",
  whiteSpace: "nowrap",
};

const uploadButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 40,
  padding: "10px 16px",
  borderRadius: 8,
  border: "1px solid var(--blue)",
  background: "var(--blue)",
  color: "white",
  fontWeight: 800,
  fontSize: ".82rem",
  cursor: "pointer",
  fontFamily: "inherit",
  boxShadow: "0 10px 22px rgba(37, 99, 235, .18)",
};
