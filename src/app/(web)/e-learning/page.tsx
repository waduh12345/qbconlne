"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Rocket,
  PlayCircle,
  Database,
  PieChart,
  Video,
  Timer,
  Workflow,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";

const features = [
  {
    title: "Bank Soal Tanpa Batas",
    desc: "Ribuan koleksi soal TKA, TPS, dan soal mandiri PTLN yang terus diupdate.",
    icon: Database,
    color: "#024BA6",
    bg: "bg-blue-50",
  },
  {
    title: "Analisis Nilai Real-time",
    desc: "Selesai ujian, nilai langsung keluar lengkap dengan analisis kelemahanmu.",
    icon: PieChart,
    color: "#F59E0B",
    bg: "bg-amber-50",
  },
  {
    title: "Video & Modul Digital",
    desc: "Akses materi pembelajaran visual kapanpun kamu butuh review ulang.",
    icon: Video,
    color: "#D4420C",
    bg: "bg-orange-50",
  },
];

const cbtFeatures = [
  {
    icon: Timer,
    text: "Sistem Timer & Blocking Time per sub-tes.",
    color: "#D4420C",
  },
  {
    icon: Workflow,
    text: "Pembahasan detail langkah demi langkah.",
    color: "#F59E0B",
  },
  {
    icon: Smartphone,
    text: "Akses mudah via Laptop, Tablet, atau HP.",
    color: "#024BA6",
  },
];

export default function ELearningPage() {
  return (
    <div className="bg-[#FDFCFB] min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="relative bg-[#024BA6] pt-20 pb-28 lg:pt-28 lg:pb-40 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <Badge className="bg-[#F59E0B] text-white text-xs font-bold uppercase tracking-widest mb-6 hover:bg-[#F59E0B]">
                Digital Learning Ecosystem
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Belajar Tanpa Batas,{" "}
                <br className="hidden md:block" />
                <span className="text-[#F59E0B]">Kapan Saja!</span>
              </h1>
              <p className="text-white/80 text-base lg:text-xl font-light mb-10 max-w-xl leading-relaxed">
                Akses ribuan bank soal, video pembahasan, dan simulasi ujian
                berbasis komputer (CBT) untuk maksimalkan persiapanmu.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#F59E0B] hover:bg-[#D4420C] text-white px-8 h-14 rounded-xl font-bold text-lg shadow-lg"
                >
                  <Link
                    href="/login"
                    target="_blank"
                    className="flex items-center gap-3"
                  >
                    <Rocket className="size-5" />
                    MASUK APLIKASI CBT
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-8 h-14 rounded-xl font-bold bg-transparent"
                >
                  <PlayCircle className="size-5 mr-2" /> Panduan Pengguna
                </Button>
              </div>
              <p className="text-white/50 text-xs mt-4">
                *Gunakan akun siswa Qubic yang telah terdaftar untuk masuk.
              </p>
            </motion.div>

            {/* Dashboard Mockup Image */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={scaleIn}
              className="lg:w-1/2 relative w-full max-w-[560px]"
            >
              <div className="relative z-10 bg-[#024BA6] rounded-xl p-3 shadow-2xl border-2 border-white/10">
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-gray-900 shadow-inner">
                  <Image
                    src="/images/siswa.webp"
                    alt="Dashboard CBT Mockup"
                    fill
                    className="object-cover opacity-90"
                  />
                  <div className="absolute top-0 left-0 right-0 h-10 bg-gray-800 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-gray-400 text-xs ml-4 font-mono">
                      cbt.qubic.id/dashboard
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- KEY FEATURES SECTION --- */}
      <section className="py-16 md:py-20 container mx-auto px-4 md:px-6 -mt-14 relative z-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-6`}
                style={{ color: feature.color }}
              >
                <feature.icon className="size-7" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#024BA6]">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed font-light">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- CBT HIGHLIGHT SECTION --- */}
      <section className="py-16 md:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeInUp}
              className="lg:w-1/2 order-2 lg:order-1"
            >
              <span className="text-[#D4420C] font-bold uppercase tracking-widest mb-2 block text-sm">
                Fitur Unggulan
              </span>
              <h2 className="text-3xl lg:text-5xl font-bold text-[#024BA6] mb-6 leading-tight">
                Simulasi Ujian
                <br />
                Senyata Aslinya.
              </h2>
              <p className="text-gray-600 text-base lg:text-lg mb-8 leading-relaxed font-light">
                Sistem CBT kami dirancang meniru tampilan dan tekanan waktu ujian
                sebenarnya (UTBK/Mandiri). Latih mental dan strategimu sebelum
                hari-H.
              </p>
              <ul className="space-y-4">
                {cbtFeatures.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 p-4 bg-[#024BA6]/5 rounded-xl border border-[#024BA6]/10 font-medium text-[#024BA6]"
                  >
                    <item.icon
                      className="size-6 shrink-0"
                      style={{ color: item.color }}
                    />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={scaleIn}
              className="lg:w-1/2 order-1 lg:order-2"
            >
              <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200">
                <Image
                  src="/images/slider-2.webp"
                  alt="Student using CBT"
                  width={800}
                  height={600}
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- CTA REGISTER --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-16 md:py-20 bg-[#024BA6] text-white text-center"
      >
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl lg:text-4xl font-bold mb-6">
            Belum Punya Akun Akses?
          </h2>
          <p className="text-white/80 text-base lg:text-lg max-w-2xl mx-auto mb-10 font-light">
            Fitur E-Learning & CBT eksklusif untuk siswa terdaftar Qubic Bangun
            Cita. Daftar program sekarang untuk mendapatkan akses penuh.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white px-10 h-14 rounded-xl font-bold text-lg"
          >
            <Link href="/contact">Daftar Program & Dapat Akun</Link>
          </Button>
        </div>
      </motion.section>
    </div>
  );
}
