import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-5 text-center text-white" style={{ minHeight: "60vh" }}>
      <p className="section-eyebrow mb-2">{"// 404"}</p>
      <h1 className="fw-bold mb-3">Page not found</h1>
      <p className="text-secondary mb-4">
        Halaman yang Anda cari tidak ada atau sudah dipindahkan.
      </p>
      <Link href="/" className="btn btn-info rounded-pill px-4 fw-semibold">
        Back to home
      </Link>
    </div>
  );
}
