const DEFAULT_TIMEOUT_MS = 15000

export function withQueryTimeout(query, label, timeoutMs = DEFAULT_TIMEOUT_MS) {
  let timeoutId

  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new Error(
          `${label} terlalu lama merespons. Periksa koneksi internet atau konfigurasi Supabase.`,
        ),
      )
    }, timeoutMs)
  })

  return Promise.race([query, timeout]).finally(() => {
    clearTimeout(timeoutId)
  })
}
