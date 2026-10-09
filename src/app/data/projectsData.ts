// src/data/projectsData.ts
export interface Project {
  id: number;
  slug: string;
  title: { ID: string; EN: string };
  category: string;
  year: string;
  description: { ID: string; EN: string };
  about: { ID: string; EN: string };
  image: string;
  gallery: string[];
  tags: string[];
  features: { ID: string; EN: string }[];
  technologies: {
    name: string;
    description: string;
    iconUrl?: string;
  }[];
  liveLink: string;
  githubLink: string;
}

/* Catatan: iconUrl memakai SVG lokal di /public/skills (bukan CDN devicon).
 * image/gallery masih PNG asli — sesuai keputusan, tidak dikonversi. */
export const projectsData: Project[] = [
  {
    id: 1,
    slug: "flower-shop-website",
    title: {
      ID: "Situs Web Toko Bunga",
      EN: "Flower Shop Website",
    },
    category: "Landing Page",
    year: "2026",
    description: {
      ID: "Situs e-commerce modern untuk toko bunga dengan desain responsif.",
      EN: "A modern e-commerce website for a flower shop with responsive design.",
    },
    about: {
      ID: "Proyek ini dirancang untuk memberikan pengalaman berbelanja bunga segar secara online dengan antarmuka yang bersih, cepat, dan intuitif bagi pengguna.",
      EN: "This project is designed to provide a seamless online fresh flower shopping experience with a clean, fast, and intuitive user interface.",
    },
    image: "/projects/flower_shop/home.png",
    gallery: [
      "/projects/flower_shop/home.png",
      "/projects/flower_shop/keunggulan.png",
      "/projects/flower_shop/kategori.png",
      "/projects/flower_shop/katalog.png",
      "/projects/flower_shop/testimoni.png",
      "/projects/flower_shop/kontak.png",
    ],
    tags: ["HTML", "Tailwind CSS", "JavaScript"],
    features: [
      { ID: "Desain Responsif", EN: "Responsive Design" },
      { ID: "Antarmuka Ramah Pengguna", EN: "User Friendly Interface" },
      { ID: "Performa Memuat Cepat", EN: "Fast Loading Performance" },
      { ID: "Tampilan Bersih & Modern", EN: "Clean & Modern UI" },
      { ID: "Kesesuaian Lintas Browser", EN: "Cross Browser Compatible" },
    ],
    technologies: [
      {
        name: "HTML",
        description: "Markup language for creating web pages and applications.",
        iconUrl: "/skills/html5.svg",
      },
      {
        name: "Tailwind CSS",
        description: "Utility-first CSS framework for rapid UI development.",
        iconUrl: "/skills/tailwindcss.svg",
      },
      {
        name: "JavaScript",
        description: "Programming language for interactive web experiences.",
        iconUrl: "/skills/javascript.svg",
      },
    ],
    liveLink: "https://cfcahaya.com",
    githubLink: "https://github.com",
  },
  {
    id: 2,
    slug: "mini-market-cashier",
    title: {
      ID: "Aplikasi Kasir Mini Market",
      EN: "Mini-Market Cashier Application",
    },
    category: "E-Commerce",
    year: "2025",
    description: {
      ID: "Aplikasi kasir desktop untuk mini market dengan manajemen produk, stok, dan laporan penjualan.",
      EN: "A desktop cashier application for mini markets with product, stock, and sales report management.",
    },
    about: {
      ID: "Aplikasi point-of-sale berbasis desktop yang mengelola penjualan, pembelian, data supplier, serta laporan laba rugi dan piutang — dirancang untuk kasir dan manajer toko.",
      EN: "A desktop point-of-sale application covering sales, purchasing, supplier data, and profit/loss and receivables reports — built for cashiers and store managers.",
    },
    image: "/projects/kasir_sakpore/login.png",
    gallery: [
      "/projects/kasir_sakpore/login.png",
      "/projects/kasir_sakpore/kasir.png",
      "/projects/kasir_sakpore/penjualan_hari_ini.png",
      "/projects/kasir_sakpore/laporan_penjualan.png",
      "/projects/kasir_sakpore/laporan_laba_dan_rugi.png",
      "/projects/kasir_sakpore/kelola_pengguna.png",
    ],
    tags: ["JAVA", "NetBeans", "MySQL"],
    features: [
      { ID: "Transaksi Kasir Cepat", EN: "Fast Checkout Transactions" },
      { ID: "Manajemen Stok Produk", EN: "Product Stock Management" },
      { ID: "Laporan Laba Rugi & Piutang", EN: "Profit & Receivables Reports" },
      { ID: "Hak Akses Multi-Peran", EN: "Multi-Role Access Control" },
      { ID: "Monitoring Penjualan Real-Time", EN: "Real-Time Sales Monitoring" },
    ],
    technologies: [
      {
        name: "Java",
        description: "Object-oriented language used for the desktop application core.",
        iconUrl: "/skills/java.svg",
      },
      {
        name: "MySQL",
        description: "Relational database for products, transactions, and reports.",
        iconUrl: "/skills/mysql.svg",
      },
    ],
    liveLink: "https://example.com",
    githubLink: "https://github.com",
  },
  {
    id: 3,
    slug: "employee-attendance-system",
    title: {
      ID: "Sistem Presensi Karyawan",
      EN: "Employee Attendance System",
    },
    category: "Web App",
    year: "2025",
    description: {
      ID: "Aplikasi presensi berbasis web dengan QR check-in, validasi lokasi, dan rekap kehadiran otomatis.",
      EN: "A web-based attendance app with QR check-in, location validation, and automatic attendance summaries.",
    },
    about: {
      ID: "Sistem presensi internal yang menggantikan absensi manual: karyawan scan QR harian, sistem memvalidasi lokasi dan jam kerja, lalu HR mendapatkan rekap kehadiran serta denda keterlambatan secara otomatis.",
      EN: "An internal attendance system replacing manual sign-ins: employees scan a daily QR code, the system validates location and working hours, and HR receives automatic attendance summaries and late-arrival penalties.",
    },
    image: "/projects/kasir_sakpore/dashboard_admin.png",
    gallery: [
      "/projects/kasir_sakpore/login.png",
      "/projects/kasir_sakpore/dashboard_admin.png",
      "/projects/kasir_sakpore/dashboard_manager.png",
      "/projects/kasir_sakpore/kelola_pengguna.png",
      "/projects/kasir_sakpore/panduan.png",
    ],
    tags: ["PHP", "Laravel", "PostgreSQL"],
    features: [
      { ID: "Check-In QR Harian", EN: "Daily QR Check-In" },
      { ID: "Validasi Lokasi Geofence", EN: "Geofence Location Validation" },
      { ID: "Rekap Kehadiriran Otomatis", EN: "Automatic Attendance Recap" },
      { ID: "Notifikasi Keterlambatan", EN: "Late-Arrival Notifications" },
      { ID: "Ekspor Laporan CSV", EN: "CSV Report Export" },
    ],
    technologies: [
      {
        name: "PHP",
        description: "Server-side scripting language powering the application logic.",
        iconUrl: "/skills/php.svg",
      },
      {
        name: "Laravel",
        description: "Elegant PHP framework for routing, auth, and background jobs.",
        iconUrl: "/skills/laravel.svg",
      },
      {
        name: "PostgreSQL",
        description: "Object-relational database for attendance records and audits.",
        iconUrl: "/skills/postgresql.svg",
      },
    ],
    liveLink: "https://example.com",
    githubLink: "https://github.com",
  },
  {
    id: 4,
    slug: "online-course-landing-page",
    title: {
      ID: "Landing Page Kursus Online",
      EN: "Online Course Landing Page",
    },
    category: "Landing Page",
    year: "2026",
    description: {
      ID: "Halaman promosi kursus online dengan animasi scroll, harga paket, dan formulir pendaftaran.",
      EN: "A course promotion page with scroll animations, pricing plans, and a signup form.",
    },
    about: {
      ID: "Landing page konversi tinggi untuk platform kursus: hero animasi, testimoni peserta, perbandingan paket harga, dan formulir pendaftaran yang terhubung langsung ke email penyelenggara.",
      EN: "A high-conversion landing page for a course platform: animated hero, student testimonials, pricing plan comparison, and a signup form wired directly to the organizer's inbox.",
    },
    image: "/projects/flower_shop/home.png",
    gallery: [
      "/projects/flower_shop/home.png",
      "/projects/flower_shop/keunggulan.png",
      "/projects/flower_shop/testimoni.png",
      "/projects/flower_shop/kontak.png",
    ],
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    features: [
      { ID: "Animasi Scroll Interaktif", EN: "Interactive Scroll Animations" },
      { ID: "Bandingkan Paket Harga", EN: "Pricing Plan Comparison" },
      { ID: "Formulir Pendaftaran Terhubung Email", EN: "Email-Connected Signup Form" },
      { ID: "SEO Teroptimasi", EN: "SEO Optimized" },
      { ID: "Mode Gelap & Terang", EN: "Dark & Light Mode" },
    ],
    technologies: [
      {
        name: "Next.js",
        description: "React framework with SSR and automatic optimization.",
        iconUrl: "/skills/nextjs.svg",
      },
      {
        name: "TypeScript",
        description: "Statically typed JavaScript for safer UI development.",
        iconUrl: "/skills/typescript.svg",
      },
      {
        name: "Tailwind CSS",
        description: "Utility-first CSS framework for the responsive layout.",
        iconUrl: "/skills/tailwindcss.svg",
      },
    ],
    liveLink: "https://example.com",
    githubLink: "https://github.com",
  },
  {
    id: 5,
    slug: "product-analytics-dashboard",
    title: {
      ID: "Dasbor Analitik Produk",
      EN: "Product Analytics Dashboard",
    },
    category: "Dashboard",
    year: "2025",
    description: {
      ID: "Dasbor analitik penjualan dengan grafik tren, produk terlaris, dan filter rentang tanggal.",
      EN: "A sales analytics dashboard with trend charts, best-sellers, and date-range filters.",
    },
    about: {
      ID: "Dashboard internal yang mengubah ribuan baris transaksi menjadi grafik yang mudah dibaca: tren penjualan harian, produk terlaris, dan perbandingan periode — mendukung keputusan stok dan promosi.",
      EN: "An internal dashboard that turns thousands of transaction rows into readable charts: daily sales trends, best-selling products, and period comparisons — supporting stock and promotion decisions.",
    },
    image: "/projects/kasir_sakpore/monitoring_penjualan.png",
    gallery: [
      "/projects/kasir_sakpore/monitoring_penjualan.png",
      "/projects/kasir_sakpore/laporan_penjualan.png",
      "/projects/kasir_sakpore/laporan_produk_terlaris.png",
      "/projects/kasir_sakpore/laporan_kadaluarsa.png",
      "/projects/kasir_sakpore/dashboard_manager.png",
    ],
    tags: ["React", "TypeScript", "PostgreSQL"],
    features: [
      { ID: "Grafik Tren Penjualan", EN: "Sales Trend Charts" },
      { ID: "Ranking Produk Terlaris", EN: "Best-Seller Product Ranking" },
      { ID: "Filter Rentang Tanggal", EN: "Date-Range Filtering" },
      { ID: "Perbandingan Periode", EN: "Period-over-Period Comparison" },
      { ID: "Ekspor Dasbor ke PDF", EN: "Dashboard Export to PDF" },
    ],
    technologies: [
      {
        name: "React",
        description: "Component-based library for the interactive chart UI.",
        iconUrl: "/skills/react.svg",
      },
      {
        name: "TypeScript",
        description: "Typed JavaScript ensuring data-shape safety across charts.",
        iconUrl: "/skills/typescript.svg",
      },
      {
        name: "PostgreSQL",
        description: "Aggregation queries over transaction and product data.",
        iconUrl: "/skills/postgresql.svg",
      },
    ],
    liveLink: "https://example.com",
    githubLink: "https://github.com",
  },
];
