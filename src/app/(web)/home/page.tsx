"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Smile, GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fadeInUp, staggerContainer } from "@/lib/motion";

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
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: number]: number;
  }>({});

  const HERO_SLIDES = [
    {
      id: 1,
      image:
        "/images/slider-1.webp",
      title: "Raih Sekolah atau Kampus Impianmu",
      subtitle: "Persiapan matang tembus PTN & Perguruan Tinggi Luar Negeri.",
    },
    {
      id: 2,
      image:
        "/images/slider-2.webp",
      title: "Fun Learning Experience",
      subtitle: "Belajar asik, nilai rapor naik, masa depan jadi cerah!",
    },
    {
      id: 3,
      image:
        "/images/slider-3.webp",
      title: "Bimbel Terbaik untuk Masa Depanmu",
      subtitle: "Didampingi tutor berpengalaman, siap bersaing di level nasional!",
    },
  ];

  const FEATURED_PROGRAMS: Program[] = [
    {
      id: 1,
      name: "Reguler Boost",
      category: "SD - SMP - SMA",
      image: "/images/reguler.webp",
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
      image: "/images/mastery.webp",
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
      image: "/images/global.webp",
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex(
        (prevIndex) => (prevIndex + 1) % HERO_SLIDES.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [HERO_SLIDES.length]);

  const handleRegister = (id: number, name: string) => {
    alert(
      `Terima kasih! Tim Qubic akan menghubungi Anda untuk program ${name}.`
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] overflow-x-hidden">
      {/* --- HERO SLIDER --- */}
      <header className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden flex items-center">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentHeroIndex ? "opacity-100" : "opacity-0"
            }`}
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
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="container mx-auto px-4 md:px-6 relative z-20 text-white"
        >
          <Badge className="bg-[#F59E0B] text-white text-xs font-bold tracking-widest uppercase mb-4 hover:bg-[#F59E0B]">
            Resmi dan Legal
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-md">
            {HERO_SLIDES[currentHeroIndex].title}
          </h1>
          <p className="text-lg lg:text-xl mb-10 font-light max-w-2xl opacity-90">
            Fun learning bersama Qubic: Sukses tingkatkan rapor, siap TKA, &
            raih PTN/PTLN.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-[#F59E0B] hover:bg-[#D4420C] text-white px-8 h-12 rounded-xl font-bold text-base shadow-lg"
            >
              Daftar Sekarang
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-[#024BA6] px-8 h-12 rounded-xl font-bold text-base bg-transparent"
            >
              Lihat Program
            </Button>
          </div>
        </motion.div>
      </header>

      {/* --- VALUE PROPOSITION --- */}
      <section className="py-16 md:py-20 container mx-auto px-4 md:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          {[
            {
              icon: Smile,
              title: "Fun Learning",
              desc: "Metode belajar interaktif yang tidak membosankan dan mudah dipahami.",
              color: "#024BA6",
            },
            {
              icon: GraduationCap,
              title: "Target PTN/PTLN",
              desc: "Kurikulum khusus yang dirancang untuk menembus kampus impian dunia.",
              color: "#F59E0B",
            },
            {
              icon: ShieldCheck,
              title: "Lembaga Legal",
              desc: "Keamanan dan kenyamanan belajar di lembaga yang memiliki izin resmi.",
              color: "#D4420C",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="p-8 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6"
                style={{
                  backgroundColor: `${item.color}10`,
                  color: item.color,
                }}
              >
                <item.icon className="size-7" />
              </div>
              <h3 className="font-bold text-xl mb-3">{item.title}</h3>
              <p className="text-gray-500 font-light">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- E-LEARNING CTA --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="bg-[#024BA6] py-16 md:py-20"
      >
        <div className="container mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-white lg:w-2/3">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Akses CBT & E-Learning
            </h2>
            <p className="text-lg opacity-80 mb-8 max-w-xl font-light">
              Latihan soal ujian mandiri dengan ribuan database soal terupdate.
              Pantau perkembangan nilaimu secara real-time melalui aplikasi CBT
              Qubic.
            </p>
            <Link
              href="/e-learning"
              className="inline-flex items-center gap-3 bg-[#F59E0B] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#F59E0B]/90 transition-all"
            >
              Mulai Belajar Sekarang <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="lg:w-1/3">
            <div className="bg-white/10 p-3 rounded-xl">
              <div className="bg-[#EDEDED] aspect-video rounded-lg overflow-hidden">
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
      </motion.section>

      {/* --- PROGRAM UNGGULAN --- */}
      <section className="py-16 md:py-20 container mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4"
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#024BA6] mb-2">
              Pilih Programmu
            </h2>
            <p className="text-gray-500">
              Investasi terbaik untuk masa depan gemilang.
            </p>
          </div>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {FEATURED_PROGRAMS.map((prog) => {
            const selectedIdx = selectedVariants[prog.id] || 0;
            const active = prog.variants[selectedIdx];

            return (
              <motion.div
                key={prog.id}
                variants={fadeInUp}
                className="group relative bg-white border border-gray-100 hover:shadow-lg transition-shadow duration-300 rounded-2xl p-6 flex flex-col h-full"
              >
                {prog.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge
                      className={`${prog.badge.color} text-white text-[10px] font-bold shadow-md hover:${prog.badge.color}`}
                    >
                      {prog.badge.text}
                    </Badge>
                  </div>
                )}

                <div className="relative w-full h-48 md:h-56 mb-6 overflow-hidden rounded-xl">
                  <Image
                    src={prog.image}
                    alt={prog.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
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
                        className={`px-4 py-2 text-xs rounded-lg border transition-all ${
                          (selectedVariants[prog.id] || 0) === i
                            ? "bg-[#024BA6] text-white border-[#024BA6]"
                            : "border-gray-200 text-gray-500 hover:border-[#F59E0B]"
                        }`}
                      >
                        {v.duration}
                      </button>
                    ))}
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-400">Mulai dari</p>
                    <p className="text-[#D4420C] font-bold text-2xl">
                      {active.price}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <Button
                      onClick={() => handleRegister(prog.id, prog.name)}
                      variant="outline"
                      className="w-full h-12 rounded-xl text-sm font-bold uppercase tracking-widest border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-white transition-all"
                    >
                      Daftar Kelas
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* --- FOOTER CTA --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-16 md:py-20 text-center bg-[#FDFCFB] border-t border-gray-100"
      >
        <h2 className="text-2xl lg:text-4xl font-bold text-[#024BA6] mb-6">
          Siap Menjadi Bagian dari Qubic?
        </h2>
        <p className="text-gray-500 mb-10 max-w-2xl mx-auto px-4">
          Konsultasikan kebutuhan pendidikan putra-putri Anda secara gratis
          dengan konsultan pendidikan kami.
        </p>
        <a href="https://wa.me/62812236378" target="_blank" rel="noopener noreferrer">
          <Button
            size="lg"
            className="bg-[#D4420C] hover:bg-[#D4420C]/90 text-white px-10 h-14 rounded-xl font-bold text-lg shadow-lg"
          >
            Hubungi Kami via WhatsApp
          </Button>
        </a>
      </motion.section>
    </div>
  );
}
