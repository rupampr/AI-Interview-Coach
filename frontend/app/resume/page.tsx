"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { uploadResume, getMyResume } from "@/lib/api";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [resume, setResume] = useState<any>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadResume = () => {
    setLoading(true);
    getMyResume()
      .then(setResume)
      .catch(() => setResume(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadResume();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      await uploadResume(file);
      loadResume();
      setFile(null);
    } catch (err: any) {
      setError(err.message || "Failed to upload and parse resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setError("");
    } else {
      setError("Please drop a valid PDF file.");
    }
  };

  const extractedSkills: string[] = resume?.extracted_data?.skills || [];

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto w-full px-6 py-10 flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Resume Intelligence
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Resume & Skill Extraction
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Upload your PDF resume once. We parse your technical proficiencies to customize every mock interview.
            </p>
          </div>

          {resume && (
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Resume Loaded
              </span>
            </div>
          )}
        </div>

        {/* Upload Form Card */}
        <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/10 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-400" />
            {resume ? "Update or Replace Resume" : "Upload Resume (PDF)"}
          </h2>

          <form onSubmit={handleUpload} className="space-y-5">
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full min-h-[160px] px-6 py-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-zinc-700 bg-zinc-950/60 hover:border-zinc-500 hover:bg-zinc-900/60"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>

                {file ? (
                  <div className="space-y-1">
                    <p className="font-semibold text-white text-base">{file.name}</p>
                    <p className="text-xs text-blue-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to parse
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-300">
                      Drag & drop your resume PDF here, or{" "}
                      <span className="text-blue-400 underline font-semibold">browse files</span>
                    </p>
                    <p className="text-xs text-zinc-500">
                      Standard PDF format • Up to 10MB
                    </p>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setError("");
                }}
                className="hidden"
              />
            </label>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-500">
                PyMuPDF automated parsing runs instantly upon upload.
              </span>
              <button
                type="submit"
                disabled={!file || uploading}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Parsing Text...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    <span>Parse & Extract Skills</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Extracted Skills Section */}
        {loading ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-white/5 text-zinc-400 text-sm animate-pulse">
            Loading resume data...
          </div>
        ) : resume ? (
          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/10 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  Active Resume File
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  {resume.filename || "Uploaded Resume"}
                </h3>
              </div>
              <span className="text-xs text-zinc-400 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 self-start sm:self-center">
                {extractedSkills.length} Verified Skills
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                Extracted Technologies & Competencies
              </p>

              {extractedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {extractedSkills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition-colors shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-400">
                  No standard tech skills detected yet. Try uploading a text-searchable PDF.
                </p>
              )}
            </div>

            {/* Next Step Callout */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-zinc-400">
                Skills are synced with Sentence-Transformers for semantic role matching.
              </span>
              <Link
                href="/job-description"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Compare against saved job descriptions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </ProtectedRoute>
  );
}
