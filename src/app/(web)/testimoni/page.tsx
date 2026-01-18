"use client";

import { IconUser } from "@tabler/icons-react";
import React from "react";

const stats = [
  { label: "Alumni PTN", value: "850+", icon: "fa-university" },
  { label: "Lolos PTLN", value: "120+", icon: "fa-plane-departure" },
  { label: "Peningkatan Rapor", value: "95%", icon: "fa-chart-line" },
  { label: "Rating Kepuasan", value: "4.9/5", icon: "fa-star" },
];

const testimonials = [
  // --- DATA BARU DITAMBAHKAN DI SINI ---
  {
    id: 4,
    name: "Pak Sartono",
    role: "Wakasek Kurikulum SMKN 34 Jakarta",
    target: "Mitra Sekolah",
    message:
      "Atas Pendalaman Materi TKA yang telah dilakukan, saya ucapkan terima kasih kepada Qubic atas bantuannya yang cukup baik, bahkan sangat baik. Murid-murid disini mendapatkan nuansa pembelajaran baru yang semoga dapat meningkatkan hasil TKAnya.",
    color: "#10B981", // Emerald Green (Hijau)
    image: "/images/testi-image.jpeg", // Property Image Baru
  },
  {
    id: 1,
    name: "Ibu Yelti",
    role: "Orang Tua Shaelyn",
    target: "Lolos Smapnas Taruna Subang",
    message:
      "Assalamualaikum, Pak. Alhamdulilah berkat bantuan Tim Qubic, Shaelyn sudah mulai sekolah di Smapnas Subang. Mohon maaf atas segala kesalahan anak kami selama bimbel sehingga anak kami bisa menduduki sekolah impian Smapnas Taruna Subang.",
    color: "#F59E0B", // Kuning/Orange
  },
  {
    id: 2,
    name: "M. Athar",
    role: "Universiti Utara Malaysia",
    target: "Lolos PTN Malaysia",
    message:
      "Assalamualaikum, Kak. Alhamdulillah saya sudah diterima di PTN Malaysia. Terima kasih atas segala bimbingan Kakak dan seluruh Tim.",
    color: "#024BA6", // Biru
  },
  {
    id: 3,
    name: "Ibu Maya",
    role: "Orang Tua Naira",
    target: "Lolos FTI-SP ITB",
    message:
      "Assalamu'alaikum kak Ali. Terima kasih banyak untuk bimbingan, bantuan, support & do'a Kakak dan Tim Qubic untuk Naira. Alhamdulillah Naira diterima di FTI-SP ITB, Kak.",
    color: "#D4420C", // Merah Bata
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
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <span className="text-[#D4420C] font-bold tracking-widest uppercase text-sm mb-4 inline-block">
            Success Stories
          </span>
          <h1 className="text-4xl lg:text-6xl font-black text-[#024BA6] mb-6 leading-tight">
            Cerita Sukses <br />
            <span className="text-[#F59E0B]">Keluarga Qubic</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Bukti nyata dari dedikasi dan metode pembelajaran yang tepat. Kini
            giliranmu mewujudkan impian.
          </p>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="pb-24 container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#024BA6] p-6 lg:p-10 rounded-[2rem] text-white text-center shadow-xl hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="text-[#F59E0B] text-2xl lg:text-4xl mb-3">
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div className="text-2xl lg:text-4xl font-black mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] lg:text-xs uppercase tracking-widest opacity-80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- TESTIMONIAL GRID --- */}
      <section className="py-12 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 group flex flex-col h-full"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-inner bg-gray-100 flex items-center justify-center text-gray-400 text-2xl flex-shrink-0">
                  {/* LOGIKA BARU: Jika ada image tampilkan image, jika tidak tampilkan IconUser */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <IconUser className="w-10 h-10" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-[#024BA6] text-lg leading-tight line-clamp-2">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">{item.role}</p>
                </div>
              </div>

              {/* Success Badge */}
              <div
                className="self-start px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6 text-white"
                style={{ backgroundColor: item.color }}
              >
                <i className="fas fa-trophy mr-2"></i> {item.target}
              </div>

              {/* Message */}
              <div className="relative flex-grow">
                <i className="fas fa-quote-left absolute -top-2 -left-2 text-gray-100 text-4xl -z-0"></i>
                <p className="relative z-10 text-gray-600 leading-relaxed italic font-light text-sm">
                  &quot;{item.message}&quot;
                </p>
              </div>

              {/* Stars */}
              <div className="mt-8 flex gap-1 text-[#F59E0B] text-xs">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- VIDEO ACTIVITY SECTION --- */}
      <section className="py-24 bg-[#024BA6]/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-[#024BA6] mb-4">
              Intip Keseruan Belajar
            </h2>
            <p className="text-gray-500">
              Suasana Try Out dan aktivitas siswa di Qubic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {activityVideos.map((video) => (
              <div key={video.id} className="relative group">
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-black aspect-video md:aspect-[4/3] lg:aspect-video">
                  {/* Video Looping */}
                  <video
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    src={video.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                  ></video>

                  {/* Overlay Title */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse"></div>
                      <h3 className="text-white font-bold text-lg tracking-wide">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute -z-10 top-4 -right-4 w-full h-full rounded-[2rem] bg-[#024BA6]/10 group-hover:top-2 group-hover:-right-2 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="py-24 container mx-auto px-6 text-center">
        <div className="bg-gradient-to-br from-[#024BA6] to-[#013576] p-10 lg:p-20 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F59E0B]/20 rounded-full blur-3xl"></div>
          <h2 className="text-3xl lg:text-5xl font-black mb-8 relative z-10">
            Jadilah Cerita Sukses Berikutnya
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-12 text-lg font-light relative z-10">
            Jangan biarkan mimpi kuliah di kampus impian hanya jadi angan. Mulai
            langkahmu hari ini bersama Qubic Bangun Cita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button className="bg-[#F59E0B] text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-white hover:text-[#024BA6] transition-all shadow-xl">
              Daftar Sekarang
            </button>
            <button className="border-2 border-white/30 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
              Konsultasi Gratis
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}