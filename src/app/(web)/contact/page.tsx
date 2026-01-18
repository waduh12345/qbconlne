"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    grade: "",
    program: "Reguler",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logika pengiriman formulir (bisa diarahkan ke email atau API WhatsApp)
    const waMessage = `Halo Qubic! Saya ${formData.name} (Kelas ${formData.grade}). Saya tertarik dengan program ${formData.program}. %0A%0APesan: ${formData.message}`;
    window.open(`https://wa.me/6281234567890?text=${waMessage}`, "_blank");
  };

  return (
    <div className="bg-[#FDFCFB] min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="bg-[#024BA6] pt-20 pb-40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <i className="fas fa-comments text-[40rem] -ml-20 -mt-20 text-white"></i>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <span className="bg-[#D4420C] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block shadow-lg">
            Hubungi Kami
          </span>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Konsultasikan Masa <br />
            <span className="text-[#F59E0B]">Depanmu Bersama Kami</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Punya pertanyaan tentang program kami atau ingin mencoba Free Trial?
            Tim konsultan pendidikan Qubic siap melayani Anda sepenuh hati.
          </p>
        </div>
      </section>

      {/* --- CONTACT INFO & FORM SECTION --- */}
      <section className="container mx-auto px-6 -mt-24 pb-24 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Information Sidebar */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 group hover:border-[#024BA6] transition-all">
              <div className="w-14 h-14 bg-[#024BA6]/10 text-[#024BA6] rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-[#024BA6] group-hover:text-white transition-all">
                <i className="fab fa-whatsapp"></i>
              </div>
              <h4 className="font-bold text-xl text-[#024BA6] mb-2">
                WhatsApp Admin
              </h4>
              <p className="text-gray-500 text-sm mb-4">
                Respon cepat setiap Senin-Sabtu (08:00 - 17:00)
              </p>
              <a
                href="https://wa.me/6281234567890"
                className="text-[#D4420C] font-bold hover:underline"
              >
                +62 812-3456-7890
              </a>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 group hover:border-[#F59E0B] transition-all">
              <div className="w-14 h-14 bg-[#F59E0B]/10 text-[#F59E0B] rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-[#F59E0B] group-hover:text-white transition-all">
                <i className="fas fa-envelope-open-text"></i>
              </div>
              <h4 className="font-bold text-xl text-[#024BA6] mb-2">
                Email Layanan
              </h4>
              <p className="text-gray-500 text-sm mb-4">
                Untuk pengajuan kerjasama dan pertanyaan formal.
              </p>
              <span className="text-[#D4420C] font-bold">
                halo@qubicbanguncita.com
              </span>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 group hover:border-[#D4420C] transition-all">
              <div className="w-14 h-14 bg-[#D4420C]/10 text-[#D4420C] rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-[#D4420C] group-hover:text-white transition-all">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <h4 className="font-bold text-xl text-[#024BA6] mb-2">
                Kantor Pusat
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Perumahan Permata Depok Sektor Berlian 2 Blok H2/16 Cipayung,
                Depok, Jawa Barat
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-2/3">
            <div className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-2xl border border-gray-100">
              <h3 className="text-3xl font-black text-[#024BA6] mb-8 italic">
                Titip Pesan untuk Qubic
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">
                      Nama Lengkap Siswa/Orang Tua
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#F59E0B] transition-all text-sm"
                      placeholder="Contoh: Budi Santoso"
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">
                      Nomor WhatsApp Aktif
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#F59E0B] transition-all text-sm"
                      placeholder="0812xxxx"
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">
                      Kelas Saat Ini
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#F59E0B] transition-all text-sm"
                      placeholder="Contoh: 12 SMA"
                      onChange={(e) =>
                        setFormData({ ...formData, grade: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">
                      Program yang Diminati
                    </label>
                    <select
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#F59E0B] transition-all text-sm appearance-none cursor-pointer"
                      onChange={(e) =>
                        setFormData({ ...formData, program: e.target.value })
                      }
                    >
                      <option>Bimbingan Reguler</option>
                      <option>TKA & UTBK Specialist</option>
                      <option>Global Pathway (PTLN)</option>
                      <option>Try Out / CBT Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">
                    Pesan atau Pertanyaan
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#F59E0B] transition-all text-sm resize-none"
                    placeholder="Tuliskan apa yang ingin kamu tanyakan ke tim kami..."
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#024BA6] text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-[#D4420C] shadow-xl hover:-translate-y-1 transition-all"
                >
                  Kirim via WhatsApp
                </button>
                <p className="text-center text-xs text-gray-400 mt-4 italic">
                  *Tim kami akan membalas pesan Anda dalam kurun waktu kurang
                  dari 24 jam.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAPS SECTION (MOCKUP) --- */}
      <section className="py-12 container mx-auto px-6">
        <div className="relative h-[450px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2738363762696!2d106.824636!3d-6.227444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTMnMzguOCJTIDEwNsKwNDknMjguNyJF!5e0!3m2!1sid!2sid!4v1634567890123!5m2!1sid!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            title="Google Maps Lokasi Qubic"
          ></iframe>
          {/* Overlay Branding */}
          <div className="absolute top-6 left-6 bg-[#024BA6] text-white px-6 py-4 rounded-2xl shadow-xl hidden md:block animate-fadeIn">
            <h5 className="font-bold text-sm mb-1 uppercase tracking-widest">
              Kunjungi Kami Langsung
            </h5>
            <p className="text-[10px] opacity-70">
              Senin - Sabtu | 08:00 - 17:00 WIB
            </p>
          </div>
        </div>
      </section>

      {/* --- FAQ MINI SECTION --- */}
      <section className="py-24 container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-black text-[#024BA6] text-center mb-12 italic underline decoration-[#F59E0B] underline-offset-8">
          Pertanyaan Umum (FAQ)
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "Apakah ada program Free Trial?",
              a: "Tentu! Kamu bisa mengikuti 1 sesi Free Trial di setiap program pilihanmu secara gratis.",
            },
            {
              q: "Bagaimana sistem pembayarannya?",
              a: "Kami menerima transfer bank, e-wallet, hingga cicilan bulanan untuk program paket tertentu.",
            },
            {
              q: "Apa legalitas Qubic?",
              a: "Qubic Bangun Cita adalah lembaga bimbingan belajar legal yang terdaftar di bawah pengawasan dinas pendidikan terkait.",
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-[#024BA6] cursor-pointer"
            >
              <summary className="font-bold text-[#024BA6] flex justify-between items-center list-none">
                {faq.q}
                <i className="fas fa-chevron-down text-sm group-open:rotate-180 transition-transform"></i>
              </summary>
              <p className="text-gray-500 text-sm mt-4 leading-relaxed border-t border-gray-50 pt-4 font-light">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}