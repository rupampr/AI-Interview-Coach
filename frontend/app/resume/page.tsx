"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { uploadResume, getMyResume } from "@/lib/api";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [resume, setResume] = useState<any>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const loadResume = () => {
    getMyResume()
      .then(setResume)
      .catch(() => setResume(null));
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
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto w-full px-6 py-12 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-white mb-2">Resume</h1>

        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <label className="flex flex-col items-center justify-center w-full h-40 px-4 transition-all bg-zinc-900/30 border-2 border-zinc-700 border-dashed rounded-xl cursor-pointer hover:border-zinc-500 hover:bg-zinc-900/60 group">
            <div className="flex flex-col items-center space-y-2 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              
              {file ? (
                <span className="font-medium text-blue-400">{file.name}</span>
              ) : (
                <>
                  <span className="font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                    Drop your resume here, or <span className="text-blue-400 hover:text-blue-300 underline">browse</span>
                  </span>
                  <span className="text-xs text-gray-500">PDF up to 5MB</span>
                </>
              )}
            </div>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={!file || uploading}
            className="backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 px-6 rounded-lg border border-white/20 hover:border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 w-fit disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/10 disabled:hover:border-white/20"
          >
            {uploading ? "Uploading..." : "Upload resume"}
          </button>
        </form>

        {resume && (
          <div className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl transition-all hover:border-white/20 mt-6">
            <p className="text-gray-100 font-semibold text-lg tracking-tight mb-1">
              {resume.filename}
            </p>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
              Extracted skills
            </p>
            <div className="flex flex-wrap gap-2.5">
              {(resume.extracted_data?.skills || []).map((skill: string) => (
                <span
                  key={skill}
                  className="bg-white/5 text-gray-300 border border-white/10 text-sm px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}