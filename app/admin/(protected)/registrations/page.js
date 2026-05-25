"use client";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { withQueryTimeout } from "@/lib/supabase/query";

const STATUS_COLORS = {
  baru: { bg: "#dbeafe", text: "#1d4ed8" },
  diproses: { bg: "#fef9c3", text: "#a16207" },
  selesai: { bg: "#d1fae5", text: "#065f46" },
  batal: { bg: "#fee2e2", text: "#991b1b" },
};

export default function AdminRegistrations() {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await withQueryTimeout(
        supabase
          .from("registrations")
          .select("*")
          .order("created_at", { ascending: false }),
        "Data pendaftar",
      );
      if (error) {
        console.error("Load registrations error:", error);
        showToast("Gagal memuat pendaftar: " + error.message);
        setItems([]);
      } else {
        setItems(data ?? []);
      }
    } catch (error) {
      console.error("Load registrations timeout:", error);
      showToast("Gagal memuat pendaftar: " + error.message);
      setItems([]);
    }
    setLoading(false);
  }
  useEffect(() => {
    let mounted = true;

    async function loadRegistrations() {
      try {
        const { data, error } = await withQueryTimeout(
          supabase
            .from("registrations")
            .select("*")
            .order("created_at", { ascending: false }),
          "Data pendaftar",
        );
        if (!mounted) return;

        if (error) {
          console.error("Load registrations error:", error);
          showToast("Gagal memuat pendaftar: " + error.message);
          setItems([]);
        } else {
          setItems(data ?? []);
        }
      } catch (error) {
        if (!mounted) return;
        console.error("Load registrations timeout:", error);
        showToast("Gagal memuat pendaftar: " + error.message);
        setItems([]);
      }
      setLoading(false);
    }

    loadRegistrations();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("registrations")
      .update({ status })
      .eq("id", id);
    if (error) {
      console.error("Update registration status error:", error);
      showToast("Gagal memperbarui status: " + error.message);
      return;
    }
    showToast("Status diperbarui.");
    setSelected((s) => (s ? { ...s, status } : s));
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Hapus data pendaftar ini?")) return;
    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Delete registration error:", error);
      showToast("Gagal menghapus data: " + error.message);
      return;
    }
    showToast("Data dihapus.");
    setSelected(null);
    load();
  }

  const filtered = items.filter((r) => {
    const matchSearch =
      !search ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.subject?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "semua" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: items.length,
    baru: items.filter((r) => r.status === "baru").length,
    diproses: items.filter((r) => r.status === "diproses").length,
    selesai: items.filter((r) => r.status === "selesai").length,
  };

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

      <div className="mb-6 md:mb-7">
        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.8rem",
            color: "var(--navy)",
            marginBottom: 4,
          }}
        >
          Kelola Pendaftar
        </h1>
        <p style={{ color: "var(--gray-600)", fontSize: ".88rem" }}>
          Data siswa yang mendaftar melalui website
        </p>
      </div>

      {/* Mini stats — responsive: 2 cols on mobile, 4 on desktop */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 10,
          marginBottom: 20,
        }}
        className="sm:gap-3 md:gap-4"
      >
        {[
          ["Total", stats.total, "#1a56c4"],
          ["Baru", stats.baru, "#8b5cf6"],
          ["Diproses", stats.diproses, "#f59e0b"],
          ["Selesai", stats.selesai, "#10b981"],
        ].map(([l, v, c]) => (
          <div
            key={l}
            style={{
              background: "white",
              border: "1px solid var(--gray-200)",
              borderRadius: "var(--radius)",
              padding: "12px 14px",
              boxShadow: "var(--shadow-sm)",
            }}
            className="sm:p-4"
          >
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "1.5rem",
                fontWeight: 900,
                color: c,
              }}
              className="sm:text-2xl"
            >
              {v}
            </div>
            <div
              style={{
                fontSize: ".8rem",
                color: "var(--gray-600)",
                fontWeight: 600,
              }}
              className="text-xs sm:text-sm"
            >
              {l}
            </div>
          </div>
        ))}
      </div>

      {/* Filters — responsive: stack on mobile, row on desktop */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
        className="sm:gap-3"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau mapel..."
          style={{
            flex: 1,
            minWidth: 200,
            padding: "9px 14px",
            borderRadius: 9,
            border: "1.5px solid var(--gray-200)",
            fontSize: ".9rem",
            fontFamily: "inherit",
            outline: "none",
          }}
          className="min-w-fit sm:py-2 sm:px-4"
        />
        <div
          style={{
            display: "flex",
            gap: 4,
            overflowX: "auto",
            flexWrap: "wrap",
          }}
          className="sm:gap-2"
        >
          {["semua", "baru", "diproses", "selesai", "batal"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: "8px 12px",
                borderRadius: 50,
                border: `1.5px solid ${filterStatus === s ? "var(--blue)" : "var(--gray-200)"}`,
                background: filterStatus === s ? "var(--blue)" : "white",
                color: filterStatus === s ? "white" : "var(--gray-600)",
                fontWeight: 600,
                fontSize: ".75rem",
                cursor: "pointer",
                textTransform: "capitalize",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
              className="text-xs sm:text-sm sm:px-4 sm:py-2"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main grid — responsive: full-width on mobile, 2-col on lg */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: selected ? "1fr" : "1fr",
          gap: 16,
        }}
        className="lg:gap-5"
      >
        {/* Table */}
        <div
          style={{
            background: "white",
            borderRadius: "var(--radius)",
            border: "1px solid var(--gray-200)",
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
            overflowX: "auto",
          }}
          className="overflow-x-auto"
        >
          {loading ? (
            <div
              style={{
                padding: 48,
                textAlign: "center",
                color: "var(--gray-400)",
              }}
            >
              Memuat data...
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                padding: 48,
                textAlign: "center",
                color: "var(--gray-400)",
              }}
            >
              Tidak ada data yang sesuai.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: ".87rem",
                  minWidth: "700px",
                }}
              >
                <thead>
                  <tr style={{ background: "var(--gray-100)" }}>
                    {[
                      "Nama",
                      "Kelas",
                      "Mata Pelajaran",
                      "Wilayah",
                      "Status",
                      "Tanggal",
                      "Aksi",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 14px",
                          textAlign: "left",
                          color: "var(--gray-600)",
                          fontWeight: 600,
                          fontSize: ".72rem",
                          letterSpacing: ".04em",
                          textTransform: "uppercase",
                        }}
                        className="px-3 sm:px-4 py-2 sm:py-3"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => {
                    const sc = STATUS_COLORS[r.status] ?? STATUS_COLORS.baru;
                    return (
                      <tr
                        key={r.id}
                        style={{
                          borderTop: "1px solid var(--gray-200)",
                          background:
                            selected?.id === r.id
                              ? "var(--blue-pale)"
                              : i % 2 === 0
                                ? "white"
                                : "var(--off-white)",
                          cursor: "pointer",
                        }}
                        onClick={() => setSelected(r)}
                        className="hover:bg-blue-pale transition-colors"
                      >
                        <td
                          style={{
                            padding: "10px 14px",
                            fontWeight: 700,
                            color: "var(--navy)",
                          }}
                          className="px-3 sm:px-4 py-2 sm:py-3"
                        >
                          {r.name}
                        </td>
                        <td
                          style={{
                            padding: "10px 14px",
                            color: "var(--gray-600)",
                          }}
                          className="hidden sm:table-cell px-3 sm:px-4 py-2 sm:py-3"
                        >
                          {r.grade ?? "–"}
                        </td>
                        <td
                          style={{
                            padding: "10px 14px",
                            color: "var(--gray-600)",
                          }}
                          className="hidden md:table-cell px-3 sm:px-4 py-2 sm:py-3"
                        >
                          {r.subject ?? "–"}
                        </td>
                        <td
                          style={{
                            padding: "10px 14px",
                            color: "var(--gray-600)",
                          }}
                          className="hidden lg:table-cell px-3 sm:px-4 py-2 sm:py-3"
                        >
                          {r.location ?? "–"}
                        </td>
                        <td
                          style={{ padding: "10px 14px" }}
                          className="px-3 sm:px-4 py-2 sm:py-3"
                        >
                          <span
                            style={{
                              fontSize: ".72rem",
                              fontWeight: 700,
                              padding: "3px 8px",
                              borderRadius: 50,
                              background: sc.bg,
                              color: sc.text,
                              textTransform: "capitalize",
                            }}
                          >
                            {r.status ?? "baru"}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "10px 14px",
                            color: "var(--gray-400)",
                            fontSize: ".76rem",
                          }}
                          className="hidden sm:table-cell px-3 sm:px-4 py-2 sm:py-3"
                        >
                          {new Date(r.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </td>
                        <td
                          style={{ padding: "10px 14px" }}
                          className="px-3 sm:px-4 py-2 sm:py-3"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(r.id);
                            }}
                            style={{
                              padding: "4px 10px",
                              borderRadius: 6,
                              border: "none",
                              background: "#fee2e2",
                              color: "#dc2626",
                              fontWeight: 600,
                              fontSize: ".7rem",
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                            className="text-xs sm:text-sm sm:px-3 sm:py-1"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail panel — full-width below table on mobile, sidebar on lg */}
        {selected && (
          <div
            style={{
              background: "white",
              borderRadius: "var(--radius)",
              border: "1px solid var(--gray-200)",
              padding: 20,
              boxShadow: "var(--shadow-sm)",
            }}
            className="p-5 lg:p-6 lg:sticky lg:top-80 lg:h-fit"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "1.1rem",
                  color: "var(--navy)",
                }}
              >
                Detail Pendaftar
              </h3>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--gray-400)",
                  fontSize: "1.1rem",
                }}
              >
                ✕
              </button>
            </div>
            {[
              ["Nama", selected.name],
              ["Kelas / Jenjang", selected.grade],
              ["Mata Pelajaran", selected.subject],
              ["Wilayah / Alamat", selected.location],
              ["Nomor WA", selected.phone],
              ["Catatan", selected.notes],
            ].map(([k, v]) =>
              v ? (
                <div key={k} style={{ marginBottom: 12 }}>
                  <p
                    style={{
                      fontSize: ".72rem",
                      fontWeight: 700,
                      color: "var(--gray-400)",
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                      marginBottom: 3,
                    }}
                  >
                    {k}
                  </p>
                  <p
                    style={{
                      fontSize: ".9rem",
                      color: "var(--navy)",
                      fontWeight: k === "Nama" ? 700 : 400,
                    }}
                    className="text-sm sm:text-base"
                  >
                    {v}
                  </p>
                </div>
              ) : null,
            )}
            <div style={{ marginBottom: 16 }}>
              <p
                style={{
                  fontSize: ".72rem",
                  fontWeight: 700,
                  color: "var(--gray-400)",
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                  marginBottom: 8,
                }}
              >
                Ubah Status
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["baru", "diproses", "selesai", "batal"].map((s) => {
                  const sc = STATUS_COLORS[s];
                  return (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 50,
                        border: `1.5px solid ${selected.status === s ? sc.text : "var(--gray-200)"}`,
                        background: selected.status === s ? sc.bg : "white",
                        color:
                          selected.status === s ? sc.text : "var(--gray-500)",
                        fontWeight: 700,
                        fontSize: ".72rem",
                        cursor: "pointer",
                        textTransform: "capitalize",
                        fontFamily: "inherit",
                      }}
                      className="text-xs sm:text-sm"
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
            {selected.phone && (
              <a
                href={`https://wa.me/${selected.phone?.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full justify-center"
                style={{ display: "flex" }}
              >
                Hubungi via WhatsApp
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
