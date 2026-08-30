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

export const projectsData: Project[] = [
  {
    id: 1,
    slug: "flower-shop-website",
    title: {
      ID: "Situs Web Toko Bunga",
      EN: "Flower Shop Website",
    },
    category: "E-Commerce",
    year: "2024",
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
        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      },
    ],
    liveLink: "https://example.com",
    githubLink: "https://github.com",
  },
  {
    id: 2,
    slug: "flower-shop-website",
    title: {
      ID: "Situs Web Toko Bunga",
      EN: "Flower Shop Website",
    },
    category: "E-Commerce",
    year: "2024",
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
        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      },
    ],
    liveLink: "https://example.com",
    githubLink: "https://github.com",
  },
  {
    id: 3,
    slug: "flower-shop-website",
    title: {
      ID: "Situs Web Toko Bunga",
      EN: "Flower Shop Website",
    },
    category: "E-Commerce",
    year: "2024",
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
        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      },
    ],
    liveLink: "https://example.com",
    githubLink: "https://github.com",
  },
];