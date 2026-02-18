"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={`mb-12 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {eyebrow && (
        <span
          className={`text-sm font-bold uppercase tracking-widest mb-3 block ${
            light ? "text-[#F59E0B]" : "text-[#D4420C]"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-3xl lg:text-4xl font-bold mb-4 ${
          light ? "text-white" : "text-[#024BA6]"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`max-w-2xl text-lg font-light leading-relaxed ${
            align === "center" ? "mx-auto" : ""
          } ${light ? "text-white/70" : "text-gray-500"}`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
