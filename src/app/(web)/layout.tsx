"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Home", href: "/home" },
    { name: "Services", href: "/service" },
    { name: "Testimony", href: "/testimoni" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <section className="min-h-screen flex flex-col font-sans selection:bg-[#F59E0B] selection:text-white">
      {/* --- NAVBAR --- */}
      <nav className="bg-[#024BA6] text-white sticky top-0 z-[100] shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/home" className="flex flex-col">
            <span className="text-xl lg:text-2xl font-black tracking-tighter leading-none">
              QUBIC <span className="text-[#F59E0B]">BANGUN CITA</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-light opacity-80">
              Education Center
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold hover:text-[#F59E0B] transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/e-learning"
              className="bg-[#F59E0B] hover:bg-[#D4420C] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md"
            >
              <i className="fas fa-laptop-code"></i> E-LEARNING
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#024BA6] border-t border-white/10 p-6 flex flex-col gap-4 animate-fadeIn">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium border-b border-white/5 pb-2"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/home/e-learning"
              onClick={() => setIsMenuOpen(false)}
              className="bg-[#F59E0B] text-center py-3 rounded-xl font-bold mt-2"
            >
              MASUK E-LEARNING (CBT)
            </Link>
          </div>
        )}
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow">{children}</main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#024BA6] text-white pt-20 pb-10 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Branding & Tagline */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold mb-6">
                QUBIC <span className="text-[#F59E0B]">BANGUN CITA</span>
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6 italic">
                &quot;Fun learning bersama qubic: Sukses Meningkatkan nilai
                rapor, siap menghadapi TKA dan Raih mimpimu tembus PTN dan
                PTLN.&quot;
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F59E0B] transition-colors"
                >
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F59E0B] transition-colors"
                >
                  <i className="fab fa-tiktok text-xl"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F59E0B] transition-colors"
                >
                  <i className="fab fa-youtube text-xl"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 border-b-2 border-[#F59E0B] inline-block">
                Program Kami
              </h4>
              <ul className="space-y-4 text-sm text-white/70">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Bimbingan Rapor SD/SMP/SMA
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Persiapan UTBK & TKA
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Kuliah Luar Negeri (PTLN)
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Aplikasi CBT Qubic
                  </Link>
                </li>
              </ul>
            </div>

            {/* E-Learning Info */}
            <div>
              <h4 className="text-lg font-bold mb-6 border-b-2 border-[#F59E0B] inline-block">
                Layanan Digital
              </h4>
              <ul className="space-y-4 text-sm text-white/70">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Panduan Aplikasi CBT
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Try Out Online Gratis
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Dashboard Orang Tua
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Bank Soal Terupdate
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-6 border-b-2 border-[#F59E0B] inline-block">
                Hubungi Kami
              </h4>
              <div className="space-y-4 text-sm text-white/70">
                <p className="flex items-start gap-3">
                  <i className="fas fa-map-marker-alt text-[#F59E0B] mt-1"></i>
                  <span>
                    Perumahan Permata Depok Sektor Berlian 2 Blok H2/16
                    Cipayung, Depok, Jawa Barat
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <i className="fab fa-whatsapp text-[#F59E0B] text-lg"></i>
                  <span>+62 812 236 378</span>
                </p>
                <p className="flex items-center gap-3">
                  <i className="fas fa-envelope text-[#F59E0B]"></i>
                  <span>qubicbanguncita@gmail.com</span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
            <p>
              © 2025 Qubic Bangun Cita. Seluruh Hak Cipta Dilindungi. Lembaga
              Pendidikan Legal Terakreditasi.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-[#F59E0B]">
                Syarat & Ketentuan
              </Link>
              <Link href="#" className="hover:text-[#F59E0B]">
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-2xl hover:scale-110 transition-transform z-[999]"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </section>
  );
}