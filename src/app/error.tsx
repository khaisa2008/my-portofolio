"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container py-5 text-center text-white" style={{ minHeight: "60vh" }}>
      <p className="section-eyebrow mb-2">{"// Error"}</p>
      <h1 className="fw-bold mb-3">Something went wrong</h1>
      <p className="text-secondary mb-4">
        Terjadi kesalahan saat memuat halaman ini. Coba muat ulang.
      </p>
      <button type="button" className="btn btn-info rounded-pill px-4 fw-semibold" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
