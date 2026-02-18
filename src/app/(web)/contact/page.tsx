"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/web/section-heading";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const faqs = [
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
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    grade: "",
    program: "Bimbingan Reguler",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const waMessage = `Halo Qubic! Saya ${formData.name} (Kelas ${formData.grade}). Saya tertarik dengan program ${formData.program}. %0A%0APesan: ${formData.message}`;
    window.open(`https://wa.me/62812236378?text=${waMessage}`, "_blank");
  };

  return (
    <div className="bg-[#FDFCFB] min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="bg-[#024BA6] pt-20 pb-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="container mx-auto px-4 md:px-6 text-center relative z-10"
        >
          <Badge className="bg-[#D4420C] text-white text-xs font-bold uppercase tracking-widest mb-4 hover:bg-[#D4420C]">
            Hubungi Kami
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Konsultasikan Masa <br />
            <span className="text-[#F59E0B]">Depanmu Bersama Kami</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Punya pertanyaan tentang program kami atau ingin mencoba Free Trial?
            Tim konsultan pendidikan Qubic siap melayani Anda sepenuh hati.
          </p>
        </motion.div>
      </section>

      {/* --- CONTACT INFO & FORM SECTION --- */}
      <section className="container mx-auto px-4 md:px-6 -mt-20 pb-16 md:pb-20 relative z-20">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Information Sidebar */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:w-1/3 flex flex-col gap-4"
          >
            <motion.div
              variants={fadeInUp}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group hover:border-[#024BA6] transition-all"
            >
              <div className="w-12 h-12 bg-[#024BA6]/10 text-[#024BA6] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#024BA6] group-hover:text-white transition-all">
                <MessageCircle className="size-6" />
              </div>
              <h4 className="font-bold text-lg text-[#024BA6] mb-2">
                WhatsApp Admin
              </h4>
              <p className="text-gray-500 text-sm mb-4">
                Respon cepat setiap Senin-Sabtu (08:00 - 17:00)
              </p>
              <a
                href="https://wa.me/62812236378"
                className="text-[#D4420C] font-bold hover:underline text-sm"
              >
                62 81223 6378
              </a>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group hover:border-[#F59E0B] transition-all"
            >
              <div className="w-12 h-12 bg-[#F59E0B]/10 text-[#F59E0B] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#F59E0B] group-hover:text-white transition-all">
                <Mail className="size-6" />
              </div>
              <h4 className="font-bold text-lg text-[#024BA6] mb-2">
                Email Layanan
              </h4>
              <p className="text-gray-500 text-sm mb-4">
                Untuk pengajuan kerjasama dan pertanyaan formal.
              </p>
              <span className="text-[#D4420C] font-bold text-sm">
                qubicbanguncita@gmail.com
              </span>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group hover:border-[#D4420C] transition-all"
            >
              <div className="w-12 h-12 bg-[#D4420C]/10 text-[#D4420C] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#D4420C] group-hover:text-white transition-all">
                <MapPin className="size-6" />
              </div>
              <h4 className="font-bold text-lg text-[#024BA6] mb-2">
                Kantor Pusat
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Perumahan Permata Depok Sektor Berlian 2 Blok H2/16 Cipayung,
                Depok, Jawa Barat
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="lg:w-2/3"
          >
            <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-[#024BA6] mb-8">
                Titip Pesan untuk Qubic
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-wide">
                      Nama Lengkap Siswa/Orang Tua
                    </Label>
                    <Input
                      type="text"
                      required
                      className="h-11 rounded-xl"
                      placeholder="Contoh: Budi Santoso"
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-wide">
                      Nomor WhatsApp Aktif
                    </Label>
                    <Input
                      type="tel"
                      required
                      className="h-11 rounded-xl"
                      placeholder="0812xxxx"
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-wide">
                      Kelas Saat Ini
                    </Label>
                    <Input
                      type="text"
                      required
                      className="h-11 rounded-xl"
                      placeholder="Contoh: 12 SMA"
                      onChange={(e) =>
                        setFormData({ ...formData, grade: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-wide">
                      Program yang Diminati
                    </Label>
                    <Select
                      defaultValue="Bimbingan Reguler"
                      onValueChange={(value) =>
                        setFormData({ ...formData, program: value })
                      }
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Pilih program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bimbingan Reguler">
                          Bimbingan Reguler
                        </SelectItem>
                        <SelectItem value="TKA & UTBK Specialist">
                          TKA & UTBK Specialist
                        </SelectItem>
                        <SelectItem value="Global Pathway (PTLN)">
                          Global Pathway (PTLN)
                        </SelectItem>
                        <SelectItem value="Try Out / CBT Only">
                          Try Out / CBT Only
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold uppercase tracking-wide">
                    Pesan atau Pertanyaan
                  </Label>
                  <Textarea
                    rows={4}
                    className="rounded-xl resize-none"
                    placeholder="Tuliskan apa yang ingin kamu tanyakan ke tim kami..."
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 bg-[#024BA6] hover:bg-[#D4420C] text-white rounded-xl font-bold text-base uppercase tracking-wide"
                >
                  Kirim via WhatsApp
                </Button>
                <p className="text-center text-xs text-gray-400 italic">
                  *Tim kami akan membalas pesan Anda dalam kurun waktu kurang
                  dari 24 jam.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- MAPS SECTION --- */}
      <section className="py-12 container mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative h-[350px] md:h-[450px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2738363762696!2d106.824636!3d-6.227444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTMnMzguOCJTIDEwNsKwNDknMjguNyJF!5e0!3m2!1sid!2sid!4v1634567890123!5m2!1sid!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            title="Google Maps Lokasi Qubic"
          ></iframe>
          <div className="absolute top-4 left-4 bg-[#024BA6] text-white px-5 py-3 rounded-xl shadow-lg hidden md:block">
            <h5 className="font-bold text-sm mb-1 uppercase tracking-widest">
              Kunjungi Kami Langsung
            </h5>
            <p className="text-[10px] opacity-70">
              Senin - Sabtu | 08:00 - 17:00 WIB
            </p>
          </div>
        </motion.div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-16 md:py-20 container mx-auto px-4 md:px-6 max-w-4xl">
        <SectionHeading title="Pertanyaan Umum (FAQ)" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-white rounded-xl border border-gray-100 px-6 hover:border-[#024BA6] transition-colors data-[state=open]:border-[#024BA6]"
              >
                <AccordionTrigger className="font-semibold text-[#024BA6] hover:no-underline text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>
    </div>
  );
}
