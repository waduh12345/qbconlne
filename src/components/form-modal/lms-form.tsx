"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Lms } from "@/types/lms";

import {
  useCreateLmsMutation,
  useUpdateLmsMutation,
} from "@/services/lms.service";

import { useGetSubjectListQuery } from "@/services/master/mapel.service";
import { useGetSubjectSubListQuery } from "@/services/master/submapel.service";
import { useGetJenjangListQuery } from "@/services/master/jenjang.service";
import type { Jenjang } from "@/types/master/jenjang";
// import { useGetSchoolListQuery } from "@/services/master/school.service";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Combobox } from "@/components/ui/combo-box";
import SunRichText from "../ui/rich-text";
import { CheckCircle2, Loader2, X, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import { Badge } from "../ui/badge";

type Props = {
  initialData?: Lms;
  onSuccess?: () => void;
  onCancel?: () => void;
};

type Subject = {
  id: number;
  code: string | null;
  name: string;
};

type SubjectSub = {
  id: number;
  code: string | null;
  name: string;
  subject_id: number;
};

// type School = {
//   id: number;
//   name: string;
//   email?: string | null;
// };

export default function LmsForm({ initialData, onSuccess, onCancel }: Props) {
  // mode
  const isEdit = Boolean(initialData?.id);

  // ====== Prodi (School) ====== 🆕
  const [schoolId] = useState<number | null>(
    initialData?.school_id ?? null
  );
  // const [schoolSearch, setSchoolSearch] = useState("");

  // const {
  //   data: schoolResp,
  //   isFetching: loadingSchool,
  //   refetch: refetchSchool,
  // } = useGetSchoolListQuery({
  //   page: 1,
  //   paginate: 50,
  //   search: schoolSearch,
  // });

  // const schoolsRaw: School[] = (
  //   Array.isArray(schoolResp?.data) ? (schoolResp!.data as unknown[]) : []
  // )
  //   .map((s: unknown): School | null => {
  //     if (typeof s !== "object" || s === null) return null;
  //     const r = s as Record<string, unknown>;

  //     const idRaw = r.id;
  //     const idNum =
  //       typeof idRaw === "number"
  //         ? idRaw
  //         : typeof idRaw === "string"
  //         ? Number(idRaw)
  //         : NaN;
  //     if (!Number.isFinite(idNum)) return null;

  //     const nameRaw = (r.name ?? r.school_name) as unknown;
  //     const emailRaw = r.email as unknown;

  //     return {
  //       id: idNum,
  //       name: typeof nameRaw === "string" ? nameRaw : "-",
  //       email: typeof emailRaw === "string" ? emailRaw : null,
  //     };
  //   })
  //   .filter((x): x is School => x !== null);

  // fallback agar value terpilih muncul saat edit meski tidak di page 1
  // const schoolOptions = useMemo<School[]>(() => {
  //   if (isEdit && schoolId && !schoolsRaw.some((s) => s.id === schoolId)) {
  //     return [
  //       {
  //         id: schoolId,
  //         name: initialData?.school_name ?? "—",
  //         email: null,
  //       },
  //       ...schoolsRaw,
  //     ];
  //   }
  //   return schoolsRaw;
  // }, [isEdit, schoolId, schoolsRaw, initialData]);

  // ====== Jenjang (Konten Premium per Jenjang) ======
  const [jenjangId, setJenjangId] = useState<number | null>(
    initialData?.jenjang_id ?? null
  );
  const [jenjangSearch, setJenjangSearch] = useState("");
  const { data: jenjangResp, isFetching: loadingJenjang } =
    useGetJenjangListQuery({ page: 1, paginate: 50, search: jenjangSearch });
  const jenjangsRaw: Jenjang[] = jenjangResp?.data ?? [];

  const jenjangOptions = useMemo<Jenjang[]>(() => {
    // fallback: kalau edit & jenjang terpilih tidak ada di page 1, prepend dari initialData
    if (
      isEdit &&
      jenjangId &&
      initialData?.jenjang &&
      !jenjangsRaw.some((j) => j.id === jenjangId)
    ) {
      return [initialData.jenjang, ...jenjangsRaw];
    }
    return jenjangsRaw;
  }, [isEdit, jenjangId, initialData, jenjangsRaw]);

  // ====== Subject / Sub Subject ======
  const [subjectId, setSubjectId] = useState<number | null>(
    initialData?.subject_id ?? null
  );
  const [subjectSubId, setSubjectSubId] = useState<number | null>(
    initialData?.subject_sub_id ?? null
  );
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [subTitle, setSubTitle] = useState(initialData?.sub_title ?? "");
  const [status, setStatus] = useState<boolean>(
    Boolean(initialData?.status ?? true)
  );
  const [description, setDescription] = useState<string>(
    initialData?.description ?? ""
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    typeof initialData?.cover === "string" ? initialData?.cover : null
  );

  // subjects
  const [subjectSearch, setSubjectSearch] = useState("");
  const {
    data: subjectResp,
    isFetching: loadingSubject,
    refetch: refetchSubject,
  } = useGetSubjectListQuery({ page: 1, paginate: 50, search: subjectSearch });

  const subjects: Subject[] = (subjectResp?.data ?? []).map((s) => ({
    ...s,
    id: Number(s.id),
  }));

  // subject subs (depend on subjectId)
  const [subSearch, setSubSearch] = useState("");
  const {
    data: subResp,
    isFetching: loadingSub,
    refetch: refetchSub,
  } = useGetSubjectSubListQuery(
    {
      page: 1,
      paginate: 50,
      search: subSearch,
      subject_id: subjectId ?? undefined,
    },
    { skip: !subjectId }
  );
  const subjectSubs: SubjectSub[] = (subResp?.data ?? []).map((s) => ({
    ...s,
    id: Number(s.id),
  }));

  // reset sub jika subject berubah (bukan saat initial render)
  const prevSubjectIdRef = useRef<number | null>(
    initialData?.subject_id ?? null
  );
  useEffect(() => {
    const prev = prevSubjectIdRef.current;
    if (prev === null) {
      prevSubjectIdRef.current = subjectId;
      return; // initial mount
    }
    if (prev !== subjectId) {
      setSubjectSubId(null);
      prevSubjectIdRef.current = subjectId;
      if (subjectId) refetchSub();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId]);

  // fallback option saat edit jika selected tidak ada di list
  const subjectOptions = useMemo<Subject[]>(() => {
    if (isEdit && subjectId && !subjects.some((s) => s.id === subjectId)) {
      return [
        {
          id: subjectId,
          code: initialData?.subject_code ?? null,
          name: initialData?.subject_name ?? "—",
        },
        ...subjects,
      ];
    }
    return subjects;
  }, [isEdit, subjectId, subjects, initialData]);

  const subjectSubOptions = useMemo<SubjectSub[]>(() => {
    if (
      isEdit &&
      subjectId &&
      subjectSubId &&
      !subjectSubs.some((s) => s.id === subjectSubId)
    ) {
      return [
        {
          id: subjectSubId,
          code: initialData?.subject_sub_code ?? null,
          name: initialData?.subject_sub_name ?? "—",
          subject_id: subjectId,
        },
        ...subjectSubs,
      ];
    }
    return subjectSubs;
  }, [isEdit, subjectId, subjectSubId, subjectSubs, initialData]);

  const [createLms, { isLoading: creating }] = useCreateLmsMutation();
  const [updateLms, { isLoading: updating }] = useUpdateLmsMutation();
  const isSaving = creating || updating;

  const handleCoverChange = (file: File | null) => {
    setCoverFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
    } else {
      setCoverPreview(null);
    }
  };

  const getOptionLabelSubject = (s: Subject) => `${s.code ?? "-"} — ${s.name}`;
  const getOptionLabelSub = (s: SubjectSub) => `${s.code ?? "-"} — ${s.name}`;
  // const getOptionLabelSchool = (s: School) => s.name; // 🆕

  const buildFormData = (): FormData => {
    const fd = new FormData();
    if (schoolId !== null) fd.append("school_id", String(schoolId));
    // jenjang_id null → konten gratis (semua siswa). Set → konten premium per-jenjang.
    if (jenjangId !== null) fd.append("jenjang_id", String(jenjangId));
    if (subjectId !== null) fd.append("subject_id", String(subjectId));
    if (subjectSubId !== null)
      fd.append("subject_sub_id", String(subjectSubId));
    fd.append("title", title);
    fd.append("sub_title", subTitle);
    fd.append("description", description ?? "");
    fd.append("status", status ? "1" : "0");
    if (coverFile) fd.append("cover", coverFile);
    return fd;
  };

  const onSubmit = async () => {
    // Validasi saat create: school, subject, sub, title wajib
    if (!isEdit) {
      if (!subjectId || !subjectSubId || !title.trim()) {
        await Swal.fire({
          icon: "warning",
          title: "Lengkapi Data",
          text: "Sekolah, Subject, Sub Subject, dan Title wajib diisi.",
        });
        return;
      }
    }

    try {
      const payload = buildFormData();
      if (isEdit) {
        await updateLms({ id: initialData!.id, payload }).unwrap();
      } else {
        await createLms(payload).unwrap();
      }
      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data tersimpan.",
      });
      onSuccess?.();
    } catch (e) {
      console.error(e);
      await Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Tidak dapat menyimpan data.",
      });
    }
  };

  const subEnabled = !!subjectId;

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
      {/* Prodi (School) 🆕 */}
      {/* <div>
        <Label className="pb-2">Sekolah</Label>
        <Combobox<School>
          value={schoolId}
          onChange={(v) => setSchoolId(v)}
          onSearchChange={(q) => {
            setSchoolSearch(q);
            refetchSchool();
          }}
          onOpenRefetch={refetchSchool}
          data={schoolOptions}
          isLoading={loadingSchool}
          placeholder="Pilih Sekolah"
          getOptionLabel={getOptionLabelSchool}
        />
      </div> */}

      {/* Jenjang (Konten Premium per Jenjang) */}
      <div className="rounded-2xl border bg-gradient-to-br from-amber-50/40 to-background p-4 space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">
            Konten Premium per Jenjang
          </Label>
          {jenjangId !== null && (
            <Badge className="bg-amber-500 hover:bg-amber-500 text-white">
              Premium
            </Badge>
          )}
        </div>
        <Combobox<Jenjang>
          value={jenjangId}
          onChange={(v) => setJenjangId(v)}
          onSearchChange={setJenjangSearch}
          data={jenjangOptions}
          isLoading={loadingJenjang}
          placeholder="Kosongkan untuk konten gratis (semua siswa)"
          getOptionLabel={(j) => (j.value ? `${j.name} — ${j.value}` : j.name)}
        />
        <p className="text-xs text-muted-foreground">
          Kosongkan = konten gratis untuk semua siswa. Pilih jenjang =
          konten dikunci untuk siswa premium pada jenjang tersebut.
        </p>
        {jenjangId !== null && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs h-7"
            onClick={() => setJenjangId(null)}
          >
            <X className="mr-1 h-3 w-3" />
            Hapus pilihan jenjang
          </Button>
        )}
      </div>

      {/* Subject & Sub Subject */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="pb-2">Mata Pelajaran</Label>
          <Combobox<Subject>
            value={subjectId}
            onChange={(v) => setSubjectId(v)}
            onSearchChange={(q) => {
              setSubjectSearch(q);
              refetchSubject();
            }}
            onOpenRefetch={refetchSubject}
            data={subjectOptions}
            isLoading={loadingSubject}
            placeholder="Pilih Mata Pelajaran"
            getOptionLabel={getOptionLabelSubject}
          />
        </div>

        <div>
          <Label className="pb-2">Sub Mata Pelajaran</Label>
          <div
            aria-disabled={!subEnabled}
            className={!subEnabled ? "pointer-events-none opacity-60" : ""}
          >
            <Combobox<SubjectSub>
              value={subjectSubId}
              onChange={(v) => setSubjectSubId(v)}
              onSearchChange={
                subEnabled
                  ? (q) => {
                      setSubSearch(q);
                      refetchSub();
                    }
                  : undefined
              }
              onOpenRefetch={refetchSub}
              data={subjectSubOptions}
              isLoading={loadingSub}
              placeholder={
                subEnabled
                  ? "Pilih Sub Mata Pelajaran"
                  : "Pilih Mata Pelajaran terlebih dahulu"
              }
              getOptionLabel={getOptionLabelSub}
            />
          </div>
        </div>
      </div>

      {/* Text fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="pb-2">Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label className="pb-2">Sub Title</Label>
          <Input
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
          />
        </div>

        {/* Status elegan */}
        <div className="col-span-2 mt-4 rounded-2xl border bg-gradient-to-br from-muted/40 to-background p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {status ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-rose-500" />
                )}
                <Label htmlFor="status" className="text-base font-semibold">
                  Status Konten
                </Label>
                <Badge
                  variant={status ? "default" : "secondary"}
                  className={
                    status ? "bg-emerald-600 hover:bg-emerald-600" : ""
                  }
                >
                  {status ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs tabular-nums ${
                  status ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {status ? "ON" : "OFF"}
              </span>
              <Switch
                id="status"
                checked={status}
                onCheckedChange={setStatus}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description (Rich Text) */}
      <div>
        <Label className="pb-2">Description</Label>
        <SunRichText
          value={description}
          onChange={setDescription}
          minHeight={260}
        />
      </div>

      {/* Cover */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label className="pb-2">Cover</Label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleCoverChange(e.target.files?.[0] ?? null)}
            />
            {coverPreview && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleCoverChange(null)}
                title="Hapus"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {coverPreview && (
            <img
              src={coverPreview}
              alt="Preview"
              className="mt-2 h-28 w-44 object-cover rounded border"
            />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        )}
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          Simpan
        </Button>
      </div>
    </div>
  );
}
