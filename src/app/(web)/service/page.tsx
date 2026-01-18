"use client";

import React from "react";
import Image from "next/image";

const services = [
  {
    id: "reguler",
    title: "Pelatihan Siswa",
    category: "SD - SMP - SMA",
    description: "Pendampingan akademik dan non akademik",
    features: [
      "LDKS/LDKO",
      "Perjusa/Perjusami",
      "OSN, FLS3N, FIKSI, & OPSI",
      "NSDC, LDBI, dan lomba lainnya",
    ],
    icon: "fa-book-open",
    color: "#024BA6",
    image:
      "/images/siswa.jpg",
  },
  {
    id: "reguler",
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
    icon: "fa-book-open",
    color: "#024BA6",
    image:
      "/images/guru.jpg",
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
    icon: "fa-book-open",
    color: "#024BA6",
    image:
      "/images/services3.jpeg",
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
    icon: "fa-graduation-cap",
    color: "#D4420C",
    image:
      "/images/services2.jpg",
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
    icon: "fa-globe-americas",
    color: "#F59E0B",
    image: "/images/global-service.jpg",
  },
];

export default function ServicePage() {
  return (
    <div className="bg-[#FDFCFB]">
      {/* --- HERO SECTION --- */}
      <section className="bg-[#024BA6] pt-20 pb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <i className="fas fa-shapes text-[30rem] rotate-12 text-white"></i>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-6">
            Layanan Terbaik untuk <br />
            <span className="text-[#F59E0B]">Masa Depanmu</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg lg:text-xl font-light">
            Dari peningkatan nilai rapor hingga persiapan kampus luar negeri,
            Qubic hadir dengan metode Fun Learning yang telah teruji.
          </p>
        </div>
      </section>

      {/* --- SERVICE CARDS (STAGGERED) --- */}
      <section className="container mx-auto px-6 -mt-20 relative z-20 pb-24">
        <div className="flex flex-col gap-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 transition-transform hover:scale-[1.01] duration-500`}
            >
              {/* Image Side */}
              <div className="lg:w-1/2 relative h-[300px] lg:h-auto overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                <div className="absolute bottom-6 left-6 lg:hidden">
                  <span className="bg-[#F59E0B] text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Content Side */}
              <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
                <div className="hidden lg:block mb-4">
                  <span className="text-[#D4420C] font-bold tracking-widest text-sm uppercase">
                    {service.category}
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-[#024BA6] mb-6 leading-tight">
                  {service.title}
                </h2>
                <p className="text-gray-500 text-lg mb-8 font-light leading-relaxed">
                  {service.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm font-medium text-gray-700"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
                        <i className="fas fa-check text-[10px]"></i>
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-[#024BA6] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#D4420C] transition-all shadow-lg text-center">
                    Tanya via WhatsApp
                  </button>
                  {/* <button className="bg-[#024BA6] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#D4420C] transition-all shadow-lg text-center">
                        Pelajari Detail Program
                    </button>
                    <button className="border-2 border-gray-200 text-[#024BA6] px-8 py-4 rounded-xl font-bold hover:border-[#F59E0B] transition-all text-center">
                        Tanya via WhatsApp
                    </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- WHY QUBIC? (METHODOLOGY) --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-extrabold text-[#024BA6] mb-4">
              Metode Fun Learning Kami
            </h2>
            <div className="w-24 h-2 bg-[#F59E0B] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Kurikulum Adaptif",
                desc: "Menyesuaikan dengan kecepatan belajar tiap siswa.",
                icon: "fa-sync-alt",
              },
              {
                title: "Mentor Asik",
                desc: "Pengajar muda berprestasi yang berperan sebagai kakak mentor.",
                icon: "fa-users",
              },
              {
                title: "Visual & Digital",
                desc: "Pembelajaran menggunakan aset visual dan platform CBT.",
                icon: "fa-laptop-code",
              },
              {
                title: "Evaluasi Rutin",
                desc: "Progress report transparan untuk orang tua & siswa.",
                icon: "fa-chart-line",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl border border-gray-100 hover:border-[#F59E0B] hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-[#024BA6]/5 rounded-2xl flex items-center justify-center text-[#024BA6] text-2xl mb-6 group-hover:bg-[#024BA6] group-hover:text-white transition-colors">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h4 className="font-bold text-xl mb-3">{item.title}</h4>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 container mx-auto px-6">
        <div className="bg-[#D4420C] rounded-[3rem] p-10 lg:p-20 text-white flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 lg:w-2/3 text-center lg:text-left">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 italic">
              Belum yakin memilih program yang mana?
            </h2>
            <p className="text-white/80 text-lg lg:text-xl font-light">
              Jangan khawatir! Tim konsultan pendidikan Qubic siap membantu
              memetakan jalur pendidikan terbaik untukmu.
            </p>
          </div>
          <div className="relative z-10 lg:w-1/3 flex justify-center lg:justify-end">
            <button className="bg-white text-[#D4420C] px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform uppercase tracking-wider">
              Gratis Konsultasi
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}