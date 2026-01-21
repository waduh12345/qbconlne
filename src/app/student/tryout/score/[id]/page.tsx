// src/app/student/tryout/score/[id]/page.tsx
"use client";

import { use } from "react"; // IMPORT PENTING: Untuk unwrap params di Next.js 15
import { useGetParticipantHistoryByIdQuery } from "@/services/student/tryout.service";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  Trophy,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ParticipantAnswer, MCOption } from "@/types/student/tryout";
import { cn } from "@/lib/utils";

// --- 1. DEFINISI TIPE YANG LEBIH KETAT (NO ANY) ---

type CategorizedOption = {
  text: string;
  accurate: boolean;
  not_accurate: boolean;
  point: number;
  accurate_label?: string;
  not_accurate_label?: string;
};

// Union Type untuk Question Details agar tidak pakai ANY
type QuestionDetailsMultipleChoice = {
  type: "multiple_choice" | "true_false" | "multiple_choice_multiple_answer";
  question: string;
  answer: string;
  explanation?: string;
  total_point: number;
  options: MCOption[];
};

type QuestionDetailsCategorized = {
  type: "multiple_choice_multiple_category";
  question: string;
  explanation?: string;
  total_point: number;
  options: CategorizedOption[];
};

type QuestionDetailsEssay = {
  type: "essay";
  question: string;
  explanation?: string;
  total_point: number;
};

// Discriminated Union
type QuestionDetailsVariant =
  | QuestionDetailsMultipleChoice
  | QuestionDetailsCategorized
  | QuestionDetailsEssay;

// --- Components Helpers ---

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getOptionLabel = (index: number, explicitOption?: string) => {
  if (explicitOption) return explicitOption.toUpperCase();
  return String.fromCharCode(65 + index); // 65 = 'A'
};

// --- Sub-Component: Multiple Choice Normal ---
const MultipleChoiceReview = ({
  options,
  userAnswer,
  correctAnswer,
}: {
  options: MCOption[];
  userAnswer: string | null;
  correctAnswer: string | null;
}) => {
  const userAnswerList = userAnswer
    ? userAnswer
        .toLowerCase()
        .split(",")
        .map((s) => s.trim())
    : [];

  const correctAnswerList = correctAnswer
    ? correctAnswer
        .toLowerCase()
        .split(",")
        .map((s) => s.trim())
    : [];

  return (
    <div className="space-y-3">
      {options.map((opt, i) => {
        const label = getOptionLabel(i, opt.option);
        const optionKey = label.toLowerCase();
        const rawOptionKey = opt.option ? opt.option.toLowerCase() : optionKey;

        const isSelected = userAnswerList.includes(rawOptionKey);
        const isKey = correctAnswerList.includes(rawOptionKey);

        const optionPoint = opt.point || 0;
        const isPartialCorrect = isSelected && !isKey && optionPoint > 0;

        let containerClass = "border-zinc-200 bg-white hover:bg-zinc-50";
        let badgeClass = "border-zinc-300 bg-zinc-50 text-zinc-500";
        let indicatorIcon = null;
        let statusLabel = null;

        if (isSelected && isKey) {
          containerClass =
            "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500";
          badgeClass = "border-emerald-500 bg-emerald-100 text-emerald-700";
          indicatorIcon = <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
          statusLabel = (
            <span className="text-xs font-bold text-emerald-600 ml-2">
              (Jawaban Kamu - Benar)
            </span>
          );
        } else if (isPartialCorrect) {
          containerClass =
            "border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500";
          badgeClass = "border-yellow-500 bg-yellow-100 text-yellow-700";
          indicatorIcon = <AlertCircle className="h-5 w-5 text-yellow-600" />;
          statusLabel = (
            <span className="text-xs font-bold text-yellow-700 ml-2">
              (Jawaban Kamu - Poin: {optionPoint})
            </span>
          );
        } else if (isSelected && !isKey) {
          containerClass = "border-rose-500 bg-rose-50 ring-1 ring-rose-500";
          badgeClass = "border-rose-500 bg-rose-100 text-rose-700";
          indicatorIcon = <XCircle className="h-5 w-5 text-rose-600" />;
          statusLabel = (
            <span className="text-xs font-bold text-rose-600 ml-2">
              (Jawaban Kamu - Salah)
            </span>
          );
        } else if (!isSelected && isKey) {
          containerClass = "border-emerald-300 bg-emerald-50/40 border-dashed";
          badgeClass = "border-emerald-300 bg-emerald-100 text-emerald-700";
          indicatorIcon = (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 opacity-60" />
          );
          statusLabel = (
            <span className="text-xs font-bold text-emerald-600 opacity-80 ml-2">
              (Kunci Jawaban)
            </span>
          );
        }

        return (
          <div
            key={i}
            className={cn(
              "relative flex items-start gap-3 rounded-lg border p-4 transition-all",
              containerClass
            )}
          >
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold uppercase shadow-sm",
                  badgeClass
                )}
              >
                {label}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center mb-1">{statusLabel}</div>
              <div
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: opt.text }}
              />
            </div>
            {indicatorIcon && (
              <div className="shrink-0 pt-0.5">{indicatorIcon}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// --- Sub-Component: Categorized ---
const CategorizedReview = ({
  options,
  userAnswer,
}: {
  options: CategorizedOption[];
  userAnswer: string | null;
}) => {
  const userAnswers = userAnswer ? userAnswer.split(",") : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4">
        <div className="col-span-6 md:col-span-8">Pernyataan</div>
        <div className="col-span-3 md:col-span-2 text-center">Jawaban Kamu</div>
        <div className="col-span-3 md:col-span-2 text-center">Kunci</div>
      </div>

      {options.map((opt, i) => {
        const userAns = userAnswers[i]?.trim();
        const correctAns = opt.accurate ? "accurate" : "not_accurate";
        const isUserCorrect = userAns === correctAns;

        const labelTrue = opt.accurate_label || "Benar";
        const labelFalse = opt.not_accurate_label || "Salah";
        const getUserLabel = (ans: string) =>
          ans === "accurate" ? labelTrue : labelFalse;

        return (
          <div
            key={i}
            className={cn(
              "grid grid-cols-12 gap-4 items-center rounded-lg border p-4 text-sm",
              isUserCorrect
                ? "bg-emerald-50/30 border-emerald-200"
                : "bg-rose-50/30 border-rose-200"
            )}
          >
            <div className="col-span-6 md:col-span-8">
              <div dangerouslySetInnerHTML={{ __html: opt.text }} />
            </div>

            <div className="col-span-3 md:col-span-2 flex flex-col items-center justify-center">
              <Badge
                variant={isUserCorrect ? "default" : "destructive"}
                className={cn(
                  "whitespace-nowrap shadow-none",
                  isUserCorrect
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                    : "bg-rose-100 text-rose-700 hover:bg-rose-100"
                )}
              >
                {userAns ? getUserLabel(userAns) : "-"}
              </Badge>
            </div>

            <div className="col-span-3 md:col-span-2 flex flex-col items-center justify-center border-l border-zinc-200 pl-4">
              <span className="font-semibold text-zinc-700">
                {getUserLabel(correctAns)}
              </span>
              {!isUserCorrect && (
                <span className="text-[10px] text-zinc-400">(Kunci)</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Question Item Wrapper ---
const QuestionReviewItem = ({
  answerData,
  index,
}: {
  answerData: ParticipantAnswer;
  index: number;
}) => {
  const questionDetails = answerData.question_details as QuestionDetailsVariant;
  const { user_answer, is_correct, point } = answerData;
  const type = questionDetails.type;

  let displayUserAnswer = "-";
  let displayCorrectKey = "-";

  if (
    type === "multiple_choice" ||
    type === "true_false" ||
    type === "multiple_choice_multiple_answer"
  ) {
    displayUserAnswer = user_answer ? user_answer.toUpperCase() : "-";
    displayCorrectKey = questionDetails.answer
      ? questionDetails.answer.toUpperCase()
      : "-";
  } else if (type === "multiple_choice_multiple_category") {
    displayUserAnswer = "Lihat Detail";
    displayCorrectKey = "Lihat Detail";
  }

  const currentPoint = point ?? 0;
  const isPartial = currentPoint > 0 && !is_correct;

  return (
    <Card className="mb-6 overflow-hidden border-zinc-200 shadow-sm">
      <CardHeader className="bg-zinc-50/50 px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
              {index + 1}
            </span>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {type.replace(/_/g, " ")}
                </Badge>

                {type === "essay" ? (
                  <Badge variant="secondary">
                    {answerData.point !== null
                      ? `Nilai: ${point}`
                      : "Menunggu Penilaian"}
                  </Badge>
                ) : is_correct ? (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 shadow-none">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Benar
                  </Badge>
                ) : isPartial ? (
                  <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200 shadow-none">
                    <AlertCircle className="mr-1 h-3 w-3" /> Parsial
                  </Badge>
                ) : (
                  <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200 shadow-none">
                    <XCircle className="mr-1 h-3 w-3" /> Salah
                  </Badge>
                )}
              </div>

              {(type === "multiple_choice" ||
                type === "true_false" ||
                type === "multiple_choice_multiple_answer") && (
                <div className="flex items-center gap-4 text-sm mt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500">Jawaban Kamu:</span>
                    <span
                      className={cn(
                        "font-bold px-2 py-0.5 rounded text-xs border",
                        is_correct
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isPartial
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      )}
                    >
                      {displayUserAnswer}
                    </span>
                  </div>
                  {!is_correct && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-500">Kunci:</span>
                      <span className="font-bold px-2 py-0.5 rounded text-xs bg-zinc-100 text-zinc-700 border border-zinc-200">
                        {displayCorrectKey}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="text-right text-sm text-zinc-500 sm:self-start">
            Poin:{" "}
            <span
              className={cn(
                "font-semibold",
                isPartial ? "text-yellow-600" : "text-zinc-900"
              )}
            >
              {point ?? 0}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div
          className="prose prose-sm max-w-none text-zinc-800 mb-6"
          dangerouslySetInnerHTML={{ __html: questionDetails.question }}
        />

        {(type === "multiple_choice" ||
          type === "true_false" ||
          type === "multiple_choice_multiple_answer") && (
          <MultipleChoiceReview
            options={(questionDetails as QuestionDetailsMultipleChoice).options}
            userAnswer={user_answer}
            correctAnswer={
              (questionDetails as QuestionDetailsMultipleChoice).answer
            }
          />
        )}

        {type === "multiple_choice_multiple_category" && (
          <CategorizedReview
            options={(questionDetails as QuestionDetailsCategorized).options}
            userAnswer={user_answer}
          />
        )}

        {type === "essay" && (
          <div className="mt-6">
            <h4 className="mb-2 text-sm font-medium text-zinc-700">
              Jawaban Anda:
            </h4>
            <div className="rounded-lg border bg-zinc-50 p-4 text-sm text-zinc-800">
              {user_answer ? (
                <div dangerouslySetInnerHTML={{ __html: user_answer }} />
              ) : (
                <span className="text-zinc-400 italic">Tidak ada jawaban</span>
              )}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="explanation" className="border-none">
              <AccordionTrigger className="flex w-full items-center justify-between rounded-lg bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700 hover:bg-sky-100 hover:no-underline transition-colors">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Lihat Pembahasan
                </div>
              </AccordionTrigger>
              <AccordionContent className="mt-2 rounded-lg border border-sky-100 bg-white p-5 text-sm leading-relaxed text-zinc-700 shadow-sm">
                {type !== "multiple_choice_multiple_category" &&
                  type !== "essay" && (
                    <div className="mb-4 rounded-md bg-emerald-50 p-3 border border-emerald-100 text-emerald-800 font-medium">
                      Kunci Jawaban Benar:{" "}
                      {(
                        questionDetails as QuestionDetailsMultipleChoice
                      ).answer.toUpperCase()}
                    </div>
                  )}

                {questionDetails.explanation ? (
                  <>
                    <div className="mb-2 font-bold text-zinc-900 border-b pb-2">
                      Penjelasan:
                    </div>
                    <div
                      className="prose prose-sm max-w-none prose-img:rounded-lg mt-3"
                      dangerouslySetInnerHTML={{
                        __html: questionDetails.explanation,
                      }}
                    />
                  </>
                ) : (
                  <p className="italic text-zinc-400">
                    Tidak ada pembahasan untuk soal ini.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Page Component ---
export default function StudentTryoutScorePage({
  params,
}: {
  // PERBAIKAN DI SINI: params adalah Promise<{ id: string }>
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  // PERBAIKAN DI SINI: Gunakan 'use' untuk unwrap promise
  const { id } = use(params);
  const participantTestId = Number(id);

  const {
    data: history,
    isLoading,
    isError,
  } = useGetParticipantHistoryByIdQuery(participantTestId);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-sky-600" />
      </div>
    );
  }

  if (isError || !history) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <XCircle className="h-12 w-12 text-rose-500" />
        <h2 className="mt-4 text-xl font-semibold">Data tidak ditemukan</h2>
        <p className="text-zinc-500">Gagal memuat hasil tryout.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          Kembali
        </Button>
      </div>
    );
  }

  const {
    test_details,
    created_at,
    participant_question_categories,
  } = history;

  const categories = participant_question_categories ?? [];

  // Hitung total soal benar dan salah dari semua kategori
  const totalStats = categories.reduce(
    (acc, cat) => {
      const questions = (cat.participant_questions ?? []) as ParticipantAnswer[];
      questions.forEach((q) => {
        acc.total += 1;
        if (q.is_correct) {
          acc.correct += 1;
        } else {
          acc.wrong += 1;
        }
      });
      return acc;
    },
    { total: 0, correct: 0, wrong: 0 }
  );

  // Hitung nilai persentase per 100
  const calculatedGrade =
    totalStats.total > 0
      ? Math.round((totalStats.correct / totalStats.total) * 100)
      : 0;

  return (
    <div className="min-h-screen space-y-8 bg-zinc-50/30 pb-20">
      {/* Header Section */}
      <section className="relative overflow-hidden rounded-b-3xl bg-gradient-to-r from-sky-600 to-sky-500 pb-12 pt-8 text-white shadow-md lg:rounded-3xl lg:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 lg:px-0">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 -ml-2 text-white hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar
          </Button>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge className="mb-3 bg-sky-400/50 text-sky-50 hover:bg-sky-400/60 border-none shadow-none">
                Hasil Pengerjaan
              </Badge>
              <h1 className="text-2xl font-bold md:text-4xl">
                {test_details.title}
              </h1>
              <p className="mt-2 text-sky-100">
                {test_details.sub_title ??
                  "Detail penilaian hasil tryout siswa"}
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/20">
              <div className="rounded-full bg-white p-3 text-sky-600 shadow-sm">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-sky-100 uppercase tracking-wider">
                  Nilai Akhir
                </p>
                <p className="text-3xl font-bold">{calculatedGrade}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 lg:px-0 mt-4 relative z-10">
        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
          <Card className="border-l-4 border-l-emerald-500 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Jawaban Benar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
                <CheckCircle2 className="h-5 w-5" /> {totalStats.correct} Soal
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-rose-500 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Jawaban Salah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-rose-600 font-bold text-lg">
                <XCircle className="h-5 w-5" /> {totalStats.wrong} Soal
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500 flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Tanggal Pengerjaan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-semibold text-zinc-800">
                {formatDate(created_at)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Tabs */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-800">Detail Jawaban</h2>
          {categories.length > 0 ? (
            <Tabs defaultValue={categories[0].id.toString()} className="w-full">
              <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id.toString()}
                    className="rounded-full border border-zinc-200 bg-white px-6 py-2.5 text-sm font-medium text-zinc-600 shadow-sm data-[state=active]:border-sky-500 data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700"
                  >
                    {cat.question_category_details.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {categories.map((cat) => (
                <TabsContent
                  key={cat.id}
                  value={cat.id.toString()}
                  className="space-y-6"
                >
                  <div className="rounded-xl border bg-white p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-zinc-900">
                        {cat.question_category_details.name}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Kode: {cat.question_category_details.code}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-lg px-4 py-1">
                      Point: {cat.grade}
                    </Badge>
                  </div>
                  <div>
                    {cat.participant_questions &&
                    cat.participant_questions.length > 0 ? (
                      (cat.participant_questions as ParticipantAnswer[]).map(
                        (q, idx) => (
                          <QuestionReviewItem
                            key={q.question_id || idx}
                            answerData={q}
                            index={idx}
                          />
                        )
                      )
                    ) : (
                      <div className="py-12 text-center text-zinc-500">
                        Tidak ada data soal untuk kategori ini.
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="rounded-xl border bg-white p-12 text-center text-zinc-500">
              Tidak ada kategori soal yang ditemukan.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}