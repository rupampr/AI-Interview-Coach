import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let detail = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      // response wasn't JSON, keep default message
    }
    throw new Error(detail);
  }

  // 204 No Content etc.
  if (res.status === 204) return null;
  return res.json();
}

// ---------- Auth ----------
export const registerUser = (email: string, password: string, full_name: string) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name }),
  });

export const loginUser = async (email: string, password: string) => {
  const formBody = new URLSearchParams();
  formBody.append("username", email); // OAuth2PasswordRequestForm expects "username"
  formBody.append("password", password);

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody.toString(),
  });

  if (!res.ok) {
    let detail = "Login failed";
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {}
    throw new Error(detail);
  }

  return res.json();
};

export const getMe = () => request("/auth/me");

// ---------- Resume ----------
export const uploadResume = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return request("/resume/upload", { method: "POST", body: formData });
};

export const getMyResume = () => request("/resume/me");

// ---------- Job Descriptions ----------
export const createJobDescription = (title: string, raw_text: string) =>
  request("/job-description/", {
    method: "POST",
    body: JSON.stringify({ title, raw_text }),
  });

export const listJobDescriptions = () => request("/job-description/");

export const getJobDescription = (id: string) =>
  request(`/job-description/${id}`);

// ---------- Match ----------
export const matchResumeToJD = (jdId: string) =>
  request(`/match/${jdId}`, { method: "POST" });

export const getMatchHistory = () => request("/match/history");

// ---------- Interview ----------
export const startInterview = (
  job_description_id: string,
  interview_type: string,
  num_questions: number = 5
) =>
  request("/interview/start", {
    method: "POST",
    body: JSON.stringify({ job_description_id, interview_type, num_questions }),
  });

export const getInterview = (id: string) => request(`/interview/${id}`);

export const listInterviews = () => request("/interview/");

// ---------- Answer ----------
export const submitAnswer = (question_id: string, text: string) =>
  request("/answer/", {
    method: "POST",
    body: JSON.stringify({ question_id, text, source: "text" }),
  });

// ---------- Report ----------
export const generateReport = (interviewId: string) =>
  request(`/interview/${interviewId}/report`, { method: "POST" });

export const getReport = (interviewId: string) =>
  request(`/interview/${interviewId}/report`);

// ---------- Progress ----------
export const getProgressHistory = () => request("/interview/progress/history");