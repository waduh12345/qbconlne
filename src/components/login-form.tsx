"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import Image from "next/image";
import { Combobox } from "@/components/ui/combo-box";
// import { Loader2 } from "lucide-react";
import type { School } from "@/types/master/school";

import type { Register } from "@/types/user";
import { useRegisterMutation } from "@/services/auth.service";
import { useGetSchoolListPublicQuery } from "@/services/master/school.service";

export default function LoginForm() {
  const router = useRouter();

  // mode: "login" | "register"
  const [mode, setMode] = useState<"login" | "register">("login");

  // shared login fields
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // register-only fields
  const [name, setName] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  // manual school name (we only allow manual input now)
  const [manualSchoolName, setManualSchoolName] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [registerMutation, { isLoading: isRegistering }] =
    useRegisterMutation();

  const [schoolSearch, setSchoolSearch] = React.useState<string>("");
    const { data: schoolListResp, isFetching: loadingSchools } =
      useGetSchoolListPublicQuery(
        { page: 1, paginate: 30, search: schoolSearch },
        { refetchOnMountOrArgChange: true }
      );
    const schools: School[] = schoolListResp?.data ?? [];

  const [schoolId, setSchoolId] = React.useState<number | null>(
    null
  );
  // resolved school = manual only (since fetching is disabled)
  const resolvedSchoolName = useMemo(
    () => manualSchoolName.trim(),
    [manualSchoolName]
  );

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.ok) {
        router.push("/");
      } else {
        setError("Email atau password salah.");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // basic validation
    if (!name.trim()) {
      setError("Nama wajib diisi.");
      return;
    }
    if (!email.trim()) {
      setError("Email wajib diisi.");
      return;
    }
    if (!phone.trim()) {
      setError("No. Whatsapp wajib diisi.");
      return;
    }
    if (!password) {
      setError("Password wajib diisi.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Password dan konfirmasi tidak sama.");
      return;
    }

    // school_name must exist (manual only)
    const schoolNameToSend = resolvedSchoolName;
    if (!schoolNameToSend && !schoolId) {
      setError("Ketik nama sekolah Anda (manual).");
      return;
    }

    const payload: Register = {
      school_name: schoolNameToSend,
      school_id: schoolId ?? undefined,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      password_confirmation: passwordConfirmation,
    };

    setIsLoading(true);
    try {
      // call register endpoint
      await registerMutation(payload).unwrap();

      // try auto-login
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: payload.email,
        password: payload.password,
      });

      if (signInRes?.ok) {
        router.push("/");
      } else {
        // fallback: switch to login mode with success message
        setMode("login");
        setPassword("");
        setPasswordConfirmation("");
        setManualSchoolName("");
        setError("Pendaftaran berhasil. Silakan login menggunakan akun Anda.");
      }
    } catch (err: unknown) {
      // handle error safely
      let msg = "Gagal mendaftar.";
      try {
        if (typeof err === "string") {
          msg = err;
        } else if (err instanceof Error) {
          msg = err.message;
        } else if (typeof err === "object" && err !== null) {
          const e = err as Record<string, unknown>;
          if ("data" in e && typeof e.data === "object" && e.data !== null) {
            const d = e.data as Record<string, unknown>;
            if ("message" in d && typeof d.message === "string") {
              msg = d.message;
            }
          } else if ("message" in e && typeof e.message === "string") {
            msg = e.message;
          }
        }
      } catch {
        // ignore
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white text-black dark:bg-black dark:text-white">
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 left-4 z-10">
        <ModeToggle />
      </div>

      {/* Left: Login / Register Form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">
                {mode === "login" ? "Masuk ke Akun Anda" : "Daftar Akun Baru"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mode === "login"
                  ? "Masukkan email Anda untuk masuk ke akun"
                  : "Isi formulir di bawah untuk membuat akun baru"}
              </p>
            </div>
          </div>

          <form
            onSubmit={
              mode === "login" ? handleLoginSubmit : handleRegisterSubmit
            }
            className="space-y-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800"
          >
            {mode === "register" && (
              <>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Nama</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Nama lengkap"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-black dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sekolah</Label>
                    <Combobox<School>
                      value={schoolId}
                      onChange={(v) => setSchoolId(v)}
                      onSearchChange={setSchoolSearch}
                      data={schools}
                      isLoading={loadingSchools}
                      placeholder="Pilih Sekolah"
                      getOptionLabel={(s) => s.name}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="school">Jika tidak terdaftar isi sekolah dibawah ini</Label>
                    <Input
                      id="school"
                      type="text"
                      placeholder="Contoh: SMA Negeri 1 Contoh"
                      value={manualSchoolName}
                      onChange={(e) => setManualSchoolName(e.target.value)}
                      className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-black dark:text-white"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Pilih sekolah dari daftar dikomentari; saat ini hanya
                      input manual.
                    </p>
                  </div>
                </div>
              </>
            )}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-black dark:text-white"
                required
              />
            </div>

            {mode === "register" && (
              <div className="space-y-1">
                <Label htmlFor="phone">No. Whatsapp</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-black dark:text-white"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                {mode === "login" ? (
                  <a
                    href="https://wa.me/6282261936478?text=Lupa%20password%20CBT%20Qubic%20saya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
                  >
                    Forgot your password?
                  </a>
                ) : null}
              </div>

              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-black dark:text-white"
                required
              />
            </div>

            {mode === "register" && (
              <div className="space-y-1">
                <Label htmlFor="password_confirmation">
                  Konfirmasi Password
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-black dark:text-white"
                  required
                />
              </div>
            )}

            {error && <p className="text-sm text-red-500 -mt-2">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-900 dark:hover:bg-neutral-100"
              disabled={isLoading || isRegistering}
            >
              {isLoading || isRegistering
                ? "Loading..."
                : mode === "login"
                ? "Login"
                : "Daftar"}
            </Button>

            {/* Informasi + toggle (gunakan <a> sebagai trigger) */}
            <div className="text-center">
              {mode === "login" ? (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Belum punya akun?</p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setError("");
                      setMode("register");
                    }}
                    className="inline-flex items-center mt-2 text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline transition-colors"
                    aria-label="Daftar sekarang"
                  >
                    Daftar sekarang — dapat akses latihan & laporan nilai
                    <svg
                      className="ml-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                    </svg>
                  </a>

                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Dengan mendaftar kamu bisa menyimpan hasil latihan,
                    mengakses soal premium, dan menerima laporan progres.
                  </p>
                </div>
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Sudah punya akun?</p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setError("");
                      setMode("login");
                    }}
                    className="inline-flex items-center mt-2 text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline transition-colors"
                    aria-label="Masuk"
                  >
                    Masuk ke akun Anda
                    <svg
                      className="ml-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z" />
                    </svg>
                  </a>

                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Masuk untuk melanjutkan latihanmu, lihat progress, dan akses
                    materi yang telah disiapkan guru.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Right: Illustration */}
      <div className="hidden lg:block bg-neutral-100 dark:bg-neutral-900 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-12 rounded-lg">
            <Image
              src="/image-login.jpg"
              alt="Try Out"
              width={500}
              height={500}
              className="object-contain rounded-4xl"
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}
