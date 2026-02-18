"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Plane,
  TrendingUp,
  Star,
  Trophy,
  Quote,
} from "lucide-react";
import { IconUser } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/web/section-heading";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";

const stats = [
  { label: "Alumni PTN", value: "850+", icon: GraduationCap },
  { label: "Lolos PTLN", value: "120+", icon: Plane },
  { label: "Peningkatan Rapor", value: "95%", icon: TrendingUp },
  { label: "Rating Kepuasan", value: "4.9/5", icon: Star },
];

const testimonials = [
  {
    id: 4,
    name: "Pak Sartono",
    role: "Wakasek Kurikulum SMKN 34 Jakarta",
    target: "Mitra Sekolah",
    message:
      "Atas Pendalaman Materi TKA yang telah dilakukan, saya ucapkan terima kasih kepada Qubic atas bantuannya yang cukup baik, bahkan sangat baik. Murid-murid disini mendapatkan nuansa pembelajaran baru yang semoga dapat meningkatkan hasil TKAnya.",
    color: "#10B981",
    image: "/images/testi-image.jpeg",
  },
  {
    id: 1,
    name: "Ibu Yelti",
    role: "Orang Tua Shaelyn",
    target: "Lolos Smapnas Taruna Subang",
    message:
      "Assalamualaikum, Pak. Alhamdulilah berkat bantuan Tim Qubic, Shaelyn sudah mulai sekolah di Smapnas Subang. Mohon maaf atas segala kesalahan anak kami selama bimbel sehingga anak kami bisa menduduki sekolah impian Smapnas Taruna Subang.",
    color: "#F59E0B",
  },
  {
    id: 2,
    name: "M. Athar",
    role: "Universiti Utara Malaysia",
    target: "Lolos PTN Malaysia",
    message:
      "Assalamualaikum, Kak. Alhamdulillah saya sudah diterima di PTN Malaysia. Terima kasih atas segala bimbingan Kakak dan seluruh Tim.",
    color: "#024BA6",
  },
  {
    id: 3,
    name: "Ibu Maya",
    role: "Orang Tua Naira",
    target: "Lolos FTI-SP ITB",
    message:
      "Assalamu'alaikum kak Ali. Terima kasih banyak untuk bimbingan, bantuan, support & do'a Kakak dan Tim Qubic untuk Naira. Alhamdulillah Naira diterima di FTI-SP ITB, Kak.",
    color: "#D4420C",
  },
];

const activityVideos = [
  {
    id: 1,
    title: "Suasana Try Out OSN",
    url: "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimF8yMBdVBtcI86qrDaKWiyUTAgVkvjJs2mbQz",
  },
  {
    id: 2,
    title: "Suasana Try Out UTBK",
    url: "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimoQ06bPZQyEeKvXgpZWw368ijzDaukdl1N0xn",
  },
];

export default function TestimoniPage() {
  return (
    <div className="bg-[#FDFCFB] min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="relative py-16 md:py-20 bg-white overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="container mx-auto px-4 md:px-6 text-center"
        >
          <span className="text-[#D4420C] font-bold tracking-widest uppercase text-sm mb-4 inline-block">
            Success Stories
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-[#024BA6] mb-6 leading-tight">
            Cerita Sukses <br />
            <span className="text-[#F59E0B]">Keluarga Qubic</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Bukti nyata dari dedikasi dan metode pembelajaran yang tepat. Kini
            giliranmu mewujudkan impian.
          </p>
        </motion.div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="pb-16 md:pb-20 container mx-auto px-4 md:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-[#024BA6] p-6 lg:p-8 rounded-2xl text-white text-center shadow-lg"
            >
              <div className="text-[#F59E0B] mb-3">
                <stat.icon className="size-6 md:size-8 mx-auto" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold mb-1">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-widest opacity-80">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- TESTIMONIAL GRID --- */}
      <section className="py-12 container mx-auto px-4 md:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-inner bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <IconUser className="size-8" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-[#024BA6] text-base leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">{item.role}</p>
                </div>
              </div>

              {/* Success Badge */}
              <Badge
                className="self-start mb-6 text-[10px] font-bold uppercase tracking-wider text-white hover:opacity-90"
                style={{ backgroundColor: item.color }}
              >
                <Trophy className="size-3 mr-1" /> {item.target}
              </Badge>

              {/* Message */}
              <div className="relative flex-grow">
                <Quote className="absolute -top-1 -left-1 size-8 text-gray-100" />
                <p className="relative z-10 text-gray-600 leading-relaxed italic font-light text-sm">
                  &quot;{item.message}&quot;
                </p>
              </div>

              {/* Stars */}
              <div className="mt-6 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="size-3.5 fill-[#F59E0B] text-[#F59E0B]"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- VIDEO ACTIVITY SECTION --- */}
      <section className="py-16 md:py-20 bg-[#024BA6]/5">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Intip Keseruan Belajar"
            description="Suasana Try Out dan aktivitas siswa di Qubic"
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto"
          >
            {activityVideos.map((video) => (
              <motion.div key={video.id} variants={scaleIn} className="group">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 bg-black aspect-video">
                  <video
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    src={video.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                  ></video>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-10">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse"></div>
                      <h3 className="text-white font-bold text-base tracking-wide">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="py-16 md:py-20 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-gradient-to-br from-[#024BA6] to-[#013576] p-8 md:p-12 lg:p-16 rounded-2xl text-white shadow-lg"
        >
          <h2 className="text-2xl lg:text-4xl font-bold mb-6">
            Jadilah Cerita Sukses Berikutnya
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-10 text-base lg:text-lg font-light">
            Jangan biarkan mimpi kuliah di kampus impian hanya jadi angan. Mulai
            langkahmu hari ini bersama Qubic Bangun Cita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white px-10 h-14 rounded-xl font-bold text-lg"
              asChild
            >
              <Link
                href="https://wa.me/62812236378?text=Halo%2C%20saya%20ingin%20daftar%20Qubic%20Bangun%20Cita"
                target="_blank"
                rel="noopener noreferrer"
              >
                Daftar Sekarang
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-10 h-14 rounded-xl font-bold text-lg bg-transparent"
              asChild
            >
              <Link
                href="https://wa.me/62812236378?text=Halo%2C%20saya%20ingin%20konsultasi%20gratis"
                target="_blank"
                rel="noopener noreferrer"
              >
                Konsultasi Gratis
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
