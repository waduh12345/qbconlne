"use client";

import React from "react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-[#FDFCFB] min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="relative py-20 lg:py-32 bg-[#024BA6] overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B]/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4420C]/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-2/3 text-white">
              <span className="bg-[#F59E0B] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                Tentang Kami
              </span>
              <h1 className="text-4xl lg:text-7xl font-black mb-6 leading-tight">
                Membangun Cita, <br />
                <span className="text-[#F59E0B]">Menggapai Dunia.</span>
              </h1>
              <p className="text-lg lg:text-xl text-white/80 font-light max-w-2xl leading-relaxed">
                Qubic Bangun Cita bukan sekadar tempat bimbingan belajar. Kami
                adalah partner perjalanan pendidikan bagi setiap siswa untuk
                menemukan potensi terbaiknya.
              </p>
            </div>
            <div className="lg:w-1/3 relative w-full aspect-square max-w-[400px]">
              <div className="absolute inset-0 border-4 border-[#F59E0B] rounded-[3rem] translate-x-4 translate-y-4"></div>
              <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070"
                  alt="Team Qubic"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <h2 className="text-3xl lg:text-5xl font-black text-[#024BA6] mb-8">
              Lahir dari Semangat Perubahan
            </h2>
            <div className="space-y-6 text-gray-600 text-lg font-light leading-relaxed">
              <p>
                Qubic Bangun Cita didirikan dengan satu keyakinan sederhana:{" "}
                <span className="text-[#D4420C] font-semibold italic">
                  &quot;Belajar seharusnya tidak menjadi beban.&quot;
                </span>{" "}
                Kami melihat banyak siswa yang kehilangan motivasi karena metode
                yang terlalu kaku.
              </p>
              <p>
                Dengan pengalaman bertahun-tahun di dunia pendidikan, kami
                meramu metode <strong>Fun Learning</strong> yang menggabungkan
                kedalaman materi akademik dengan pendekatan psikologi belajar
                yang menyenangkan.
              </p>
              <div className="p-6 bg-white border-l-4 border-[#F59E0B] shadow-sm rounded-r-2xl">
                <h4 className="font-bold text-[#024BA6] mb-2 flex items-center gap-2">
                  <i className="fas fa-certificate text-[#F59E0B]"></i> Lembaga
                  Resmi & Legal
                </h4>
                <p className="text-sm text-gray-500 italic">
                  Terdaftar secara resmi sebagai lembaga bimbingan belajar
                  dengan izin operasional yang diakui negara. Keamanan dan
                  kualitas pendidikan Anda adalah prioritas hukum kami.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 order-1 lg:order-2 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-64 relative rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/images/about-us1.jpeg"
                  alt="Class"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="h-40 bg-[#D4420C] rounded-3xl flex items-center justify-center text-white p-6 text-center">
                <p className="font-bold text-sm italic">
                  &quot;Metode belajar adaptif untuk setiap individu.&quot;
                </p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="h-40 bg-[#024BA6] rounded-3xl flex items-center justify-center text-white p-6 text-center">
                <p className="font-bold text-sm italic">
                  &quot;Mentor muda yang inspiratif & kompeten.&quot;
                </p>
              </div>
              <div className="h-64 relative rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/images/about-us2.jpeg"
                  alt="Mentor"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- VISION & MISSION --- */}
      <section className="py-24 bg-[#024BA6]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-8">
                Visi & <br />
                <span className="text-[#F59E0B]">Misi Kami</span>
              </h2>
              <div className="w-20 h-2 bg-[#F59E0B] rounded-full"></div>
            </div>
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="text-[#F59E0B] text-4xl font-black opacity-40">
                  01
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Visi</h3>
                  <p className="text-white/70 text-lg font-light leading-relaxed">
                    Menjadi lembaga pendidikan terdepan yang menginspirasi
                    generasi muda untuk berani bermimpi dan menembus batas
                    pendidikan nasional maupun internasional.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-[#F59E0B] text-4xl font-black opacity-40">
                  02
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Misi</h3>
                  <ul className="text-white/70 text-lg font-light space-y-4 list-disc list-inside">
                    <li>
                      Menyelenggarakan pembelajaran berbasis Fun Learning yang
                      efektif.
                    </li>
                    <li>
                      Mengintegrasikan teknologi ke dalam setiap proses evaluasi
                      akademik.
                    </li>
                    <li>
                      Menciptakan ekosistem belajar yang mendukung kesehatan
                      mental siswa.
                    </li>
                    <li>
                      Membangun jaringan alumni global yang saling mendukung.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE VALUES --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-black text-[#024BA6] mb-4">
              Nilai Inti Qubic
            </h2>
            <p className="text-gray-500 text-lg font-light">
              Fondasi kami dalam melayani putra-putri Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Empowerment",
                desc: "Memberdayakan siswa untuk mandiri dalam belajar.",
                icon: "fa-rocket",
              },
              {
                title: "Integrity",
                desc: "Menjaga transparansi laporan hasil belajar.",
                icon: "fa-shield-alt",
              },
              {
                title: "Fun",
                desc: "Menghadirkan kebahagiaan di setiap sesi diskusi.",
                icon: "fa-laugh-wink",
              },
              {
                title: "Excellence",
                desc: "Mengejar standar kualitas pendidikan dunia.",
                icon: "fa-trophy",
              },
            ].map((value, i) => (
              <div
                key={i}
                className="p-10 rounded-[3rem] bg-[#FDFCFB] border border-gray-100 hover:shadow-2xl transition-all duration-300 text-center group"
              >
                <div className="w-16 h-16 bg-[#024BA6]/5 rounded-2xl flex items-center justify-center text-[#024BA6] text-3xl mx-auto mb-6 group-hover:bg-[#F59E0B] group-hover:text-white transition-all">
                  <i className={`fas ${value.icon}`}></i>
                </div>
                <h4 className="font-black text-xl text-[#024BA6] mb-4 uppercase tracking-tight">
                  {value.title}
                </h4>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-[#D4420C] p-12 lg:p-24 rounded-[4rem] text-center text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-6xl font-black mb-8 italic leading-tight">
                Mulai Perjalanan Citamu <br />
                Hari Ini!
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="bg-white text-[#D4420C] px-12 py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform uppercase">
                  Hubungi Admin
                </button>
                <button className="bg-[#024BA6] text-white px-12 py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform uppercase">
                  Lihat Program
                </button>
              </div>
            </div>
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
              <i className="fas fa-university text-[40rem]"></i>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}