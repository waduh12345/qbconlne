"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, RefreshCw, Users, Monitor, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/web/section-heading";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const services = [
  {
    id: "pelatihan-siswa",
    title: "Pelatihan Siswa",
    category: "SD - SMP - SMA",
    description: "Pendampingan akademik dan non akademik",
    features: [
      "LDKS/LDKO",
      "Perjusa/Perjusami",
      "OSN, FLS3N, FIKSI, & OPSI",
      "NSDC, LDBI, dan lomba lainnya",
    ],
    color: "#024BA6",
    image: "/images/siswa.webp",
  },
  {
    id: "pelatihan-guru",
    title: "Pelatihan Guru dan Tenaga Kependidikan",
    category: "SD - SMP - SMA",
    description:
      "Peningkatan kompetensi dan skill guru serta tenaga kependidikan",
    features: [
      "Workshop STEAM",
      "Workshop Deep Learning",
      "Workshop Motivasi Kerja",
      "Tema lainnya",
    ],
    color: "#024BA6",
    image: "/images/guru.jpg",
  },
  {
    id: "reguler",
    title: "Bimbingan Reguler & Akselerasi",
    category: "SD - SMP - SMA",
    description:
      "Fokus pada penguasaan konsep dasar dan peningkatan nilai rapor sekolah secara signifikan.",
    features: [
      "Pendampingan PR & Tugas",
      "Persiapan Ulangan Harian",
      "Modul Materi Sesuai Kurikulum Sekolah",
      "Laporan Perkembangan Bulanan",
    ],
    color: "#024BA6",
    image: "/images/services3.jpeg",
  },
  {
    id: "tka",
    title: "TKA & UTBK Specialist",
    category: "Persiapan PTN",
    description:
      "Program intensif yang dirancang khusus untuk menaklukkan soal-soal TKA dan lolos ke PTN favorit.",
    features: [
      "Bank Soal Terupdate",
      "Try Out Rutin Berkala",
      "Bedah Strategi Lolos PTN",
      "Konsultasi Pemilihan Jurusan",
    ],
    color: "#D4420C",
    image: "/images/services2.webp",
  },
  {
    id: "global",
    title: "Global Pathway Program",
    category: "Persiapan Luar Negeri",
    description:
      "Pendampingan lengkap bagi siswa yang bermimpi melanjutkan studi di universitas terbaik dunia.",
    features: [
      "Persiapan IELTS/TOEFL/SAT",
      "Personal Statement Mentoring",
      "Workshop Beasiswa Luar Negeri",
      "Bimbingan Aplikasi PTLN",
    ],
    color: "#F59E0B",
    image: "/images/global-service.jpg",
  },
];

const methodItems = [
  {
    title: "Kurikulum Adaptif",
    desc: "Menyesuaikan dengan kecepatan belajar tiap siswa.",
    icon: RefreshCw,
  },
  {
    title: "Mentor Asik",
    desc: "Pengajar muda berprestasi yang berperan sebagai kakak mentor.",
    icon: Users,
  },
  {
    title: "Visual & Digital",
    desc: "Pembelajaran menggunakan aset visual dan platform CBT.",
    icon: Monitor,
  },
  {
    title: "Evaluasi Rutin",
    desc: "Progress report transparan untuk orang tua & siswa.",
    icon: TrendingUp,
  },
];

export default function ServicePage() {
  return (
    <div className="bg-[#FDFCFB]">
      {/* --- HERO SECTION --- */}
      <section className="bg-[#024BA6] pt-20 pb-28">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="container mx-auto px-4 md:px-6 text-center relative z-10"
        >
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-6">
            Layanan Terbaik untuk <br />
            <span className="text-[#F59E0B]">Masa Depanmu</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg lg:text-xl font-light">
            Dari peningkatan nilai rapor hingga persiapan kampus dalam dan luar negeri,
            Qubic hadir dengan metode Fun Learning yang telah teruji.
          </p>
        </motion.div>
      </section>

      {/* --- SERVICE CARDS (STAGGERED) --- */}
      <section className="container mx-auto px-4 md:px-6 -mt-16 relative z-20 pb-16 md:pb-20">
        <div className="flex flex-col gap-12 md:gap-16">
          {services.map((service, index) => (
            <motion.div
              key={service.id + index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300`}
            >
              {/* Image Side */}
              <div className="lg:w-1/2 relative h-[220px] md:h-[300px] lg:h-auto overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                <div className="absolute bottom-4 left-4 lg:hidden">
                  <span className="bg-[#F59E0B] text-white px-3 py-1 rounded-lg text-xs font-bold uppercase">
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Content Side */}
              <div className="lg:w-1/2 p-8 md:p-10 lg:p-14 flex flex-col justify-center">
                <div className="hidden lg:block mb-4">
                  <span className="text-[#D4420C] font-bold tracking-widest text-sm uppercase">
                    {service.category}
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#024BA6] mb-4 leading-tight">
                  {service.title}
                </h2>
                <p className="text-gray-500 text-base mb-8 font-light leading-relaxed">
                  {service.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm font-medium text-gray-700"
                    >
                      <div className="w-5 h-5 rounded-md bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] shrink-0">
                        <Check className="size-3" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div>
                  <a
                    href={`https://wa.me/62812236378?text=${encodeURIComponent(`Halo Qubic, saya tertarik dengan program ${service.title} (${service.category}). Bisa info lebih lanjut?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-[#024BA6] hover:bg-[#D4420C] text-white px-8 h-12 rounded-xl font-bold">
                      Tanya via WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- WHY QUBIC? (METHODOLOGY) --- */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Metode Fun Learning Kami"
            description="Pendekatan belajar yang terbukti efektif dan menyenangkan."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {methodItems.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="group p-8 rounded-xl border border-gray-100 hover:border-[#F59E0B] hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#024BA6]/5 rounded-xl flex items-center justify-center text-[#024BA6] mb-6 group-hover:bg-[#024BA6] group-hover:text-white transition-colors">
                  <item.icon className="size-6" />
                </div>
                <h4 className="font-bold text-lg mb-3">{item.title}</h4>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-16 md:py-20 container mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-[#D4420C] rounded-2xl p-8 md:p-12 lg:p-16 text-white flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          <div className="lg:w-2/3 text-center lg:text-left">
            <h2 className="text-2xl lg:text-4xl font-bold mb-4">
              Belum yakin memilih program yang mana?
            </h2>
            <p className="text-white/80 text-base lg:text-lg font-light">
              Jangan khawatir! Tim konsultan pendidikan Qubic siap membantu
              memetakan jalur pendidikan terbaik untukmu.
            </p>
          </div>
          <div className="lg:w-1/3 flex justify-center lg:justify-end">
            <a
              href={`https://wa.me/62812236378?text=${encodeURIComponent("Halo Qubic, saya ingin konsultasi gratis mengenai program pendidikan yang cocok untuk saya. Terima kasih!")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-white text-[#D4420C] hover:bg-white/90 px-8 h-14 rounded-xl font-bold text-lg"
              >
                Gratis Konsultasi
              </Button>
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
