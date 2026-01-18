"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// --- TIPE DATA ---
type BadgeType = {
  text: string;
  color: string;
};

type ProgramVariant = {
  duration: string;
  price: string;
  feature: string;
};

type Program = {
  id: number;
  name: string;
  category: string;
  variants: ProgramVariant[];
  badge?: BadgeType;
  image: string;
};

export default function HomeQubic() {
  // --- STATE MANAGEMENT ---
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: number]: number }>({});

  // --- DATA SLIDES HERO ---
  const HERO_SLIDES = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070",
      title: "Raih Sekolah atau Kampus Impianmu",
      subtitle: "Persiapan matang tembus PTN & Perguruan Tinggi Luar Negeri.",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071",
      title: "Fun Learning Experience",
      subtitle: "Belajar asik, nilai rapor naik, masa depan jadi cerah!",
    },
  ];

  // --- DATA MOCKUP PROGRAM UNGGULAN ---
  const FEATURED_PROGRAMS: Program[] = [
    {
      id: 1,
      name: "Reguler Boost",
      category: "SD - SMP - SMA",
      image:
        "/images/reguler.png",
      variants: [
        {
          duration: "1 Semester",
          price: "IDR 2,500,000",
          feature: "Fokus Nilai Rapor",
        },
        {
          duration: "1 Tahun",
          price: "IDR 4,200,000",
          feature: "Full Mentoring",
        },
      ],
    },
    {
      id: 2,
      name: "TKA/UTBK Mastery",
      category: "Persiapan TKA/UTBK",
      image:
        "/images/mastery.png",
      variants: [
        {
          duration: "Intensif",
          price: "IDR 3,750,000",
          feature: "Bank Soal Akurat",
        },
      ],
      badge: { text: "POPULER", color: "bg-[#D4420C]" },
    },
    {
      id: 3,
      name: "Global Pathway",
      category: "Persiapan PTLN",
      image:
        "/images/global.png",
      variants: [
        {
          duration: "IELTS/SAT",
          price: "IDR 5,500,000",
          feature: "Scholarship Guide",
        },
      ],
      badge: { text: "GLOBAL", color: "bg-[#024BA6]" },
    },
  ];

  // --- EFFECTS ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % HERO_SLIDES.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [HERO_SLIDES.length]);

  // --- HANDLERS ---
  const handleRegister = (id: number, name: string) => {
    alert(`Terima kasih! Tim Qubic akan menghubungi Anda untuk program ${name}.`);
  };

  return (
    <div className="min-h-screen font-sans bg-[#FDFCFB] text-[#1A1A1A] overflow-x-hidden scroll-smooth">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&family=Playfair+Display:wght@700&display=swap");
        body {
          font-family: "Plus Jakarta Sans", sans-serif;
        }
        .font-serif {
          font-family: "Playfair Display", serif;
        }
        .bg-qubic-blue {
          background-color: #024ba6;
        }
        .text-qubic-blue {
          color: #024ba6;
        }
        .bg-qubic-amber {
          background-color: #f59e0b;
        }
        .bg-qubic-rust {
          background-color: #d4420c;
        }
      `}</style>

      {/* --- HERO SLIDER --- */}
      <header className="relative h-[90vh] w-full overflow-hidden flex items-center">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentHeroIndex ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#024BA6]/80 to-transparent z-10" />
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        <div className="container mx-auto px-6 relative z-20 text-white animate-fadeIn">
          <span className="bg-[#F59E0B] px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block">
            Resmi dan Legal
          </span>
          <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight drop-shadow-md">
            {HERO_SLIDES[currentHeroIndex].title}
          </h1>
          <p className="text-xl lg:text-2xl mb-10 font-light max-w-2xl opacity-90 italic">
            &quot;Fun learning bersama Qubic: Sukses tingkatkan rapor, siap TKA,
            & raih PTN/PTLN.&quot;
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-[#F59E0B] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#D4420C] transition-all shadow-lg hover:-translate-y-1">
              Daftar Sekarang
            </button>
            <button className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold hover:bg-white hover:text-[#024BA6] transition-all">
              Lihat Program
            </button>
          </div>
        </div>
      </header>

      {/* --- VALUE PROPOSITION --- */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="p-8 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-[#024BA6]/10 text-[#024BA6] rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-smile-beam text-3xl"></i>
            </div>
            <h3 className="font-bold text-xl mb-3">Fun Learning</h3>
            <p className="text-gray-500 font-light">
              Metode belajar interaktif yang tidak membosankan dan mudah
              dipahami.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-[#F59E0B]/10 text-[#F59E0B] rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-university text-3xl"></i>
            </div>
            <h3 className="font-bold text-xl mb-3">Target PTN/PTLN</h3>
            <p className="text-gray-500 font-light">
              Kurikulum khusus yang dirancang untuk menembus kampus impian
              dunia.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-[#D4420C]/10 text-[#D4420C] rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-file-signature text-3xl"></i>
            </div>
            <h3 className="font-bold text-xl mb-3">Lembaga Legal</h3>
            <p className="text-gray-500 font-light">
              Keamanan dan kenyamanan belajar di lembaga yang memiliki izin
              resmi.
            </p>
          </div>
        </div>
      </section>

      {/* --- E-LEARNING CTA (Ganti Banner) --- */}
      <section className="bg-[#024BA6] py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <i className="fas fa-laptop-code text-[20rem] -rotate-12"></i>
        </div>
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-white lg:w-2/3">
            <h2 className="text-4xl font-bold mb-4">Akses CBT & E-Learning</h2>
            <p className="text-lg opacity-80 mb-8 max-w-xl">
              Latihan soal ujian mandiri dengan ribuan database soal terupdate.
              Pantau perkembangan nilaimu secara real-time melalui aplikasi CBT
              Qubic.
            </p>
            <Link
              href="/e-learning"
              className="bg-[#F59E0B] text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-[#024BA6] transition-all inline-flex items-center gap-3"
            >
              Mulai Belajar Sekarang <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <div className="lg:w-1/3">
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/20">
              <div className="bg-[#EDEDED] aspect-video rounded-xl flex items-center justify-center text-[#024BA6]">
                <Image
                  src="/image1.png"
                  alt="E-Learning CTA"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROGRAM UNGGULAN (DENGAN VARIAN) --- */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-[#024BA6] mb-2">
              Pilih Programmu
            </h2>
            <p className="text-gray-500">
              Investasi terbaik untuk masa depan gemilang.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_PROGRAMS.map((prog) => {
            const selectedIdx = selectedVariants[prog.id] || 0;
            const active = prog.variants[selectedIdx];

            return (
              <div
                key={prog.id}
                className="group relative bg-white border border-gray-100 hover:shadow-2xl transition-all duration-500 rounded-3xl p-6 flex flex-col h-full"
              >
                {prog.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <div
                      className={`${prog.badge.color} text-white px-4 py-1 rounded-full text-[10px] font-bold shadow-md`}
                    >
                      {prog.badge.text}
                    </div>
                  </div>
                )}

                <div className="relative w-full h-56 mb-6 overflow-hidden rounded-2xl">
                  <Image
                    src={prog.image}
                    alt={prog.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-all duration-500"
                  />
                </div>

                <div className="flex flex-col flex-grow">
                  <span className="text-[#D4420C] text-xs font-bold uppercase tracking-widest mb-1">
                    {prog.category}
                  </span>
                  <h5 className="font-bold text-2xl text-[#024BA6] mb-4">
                    {prog.name}
                  </h5>

                  {/* Durasi Selector */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {prog.variants.map((v, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setSelectedVariants((prev) => ({
                            ...prev,
                            [prog.id]: i,
                          }))
                        }
                        className={`px-4 py-2 text-xs rounded-lg border transition-all ${(selectedVariants[prog.id] || 0) === i ? "bg-[#024BA6] text-white border-[#024BA6]" : "border-gray-200 text-gray-500 hover:border-[#F59E0B]"}`}
                      >
                        {v.duration}
                      </button>
                    ))}
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-400">Mulai dari</p>
                    <p className="text-[#D4420C] font-extrabold text-2xl">
                      {active.price}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <button
                      onClick={() => handleRegister(prog.id, prog.name)}
                      className="w-full py-4 bg-[#F59E0B]/10 text-[#F59E0B] rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#F59E0B] hover:text-white transition-all"
                    >
                      Daftar Kelas
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-24 text-center bg-[#FDFCFB] border-t border-gray-100">
        <h2 className="text-3xl lg:text-5xl font-bold text-[#024BA6] mb-6">
          Siap Menjadi Bagian dari Qubic?
        </h2>
        <p className="text-gray-500 mb-10 max-w-2xl mx-auto">
          Konsultasikan kebutuhan pendidikan putra-putri Anda secara gratis
          dengan konsultan pendidikan kami.
        </p>
        <button className="bg-[#D4420C] text-white px-12 py-5 rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform">
          Hubungi Kami via WhatsApp
        </button>
      </section>
    </div>
  );
}