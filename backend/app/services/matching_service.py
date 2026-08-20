import numpy as np


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    a = np.array(vec_a)
    b = np.array(vec_b)

    # Guard against zero vectors to avoid division by zero
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0

    similarity = np.dot(a, b) / (norm_a * norm_b)
    return float(similarity)


def compare_skills(resume_skills: list[str], jd_skills: list[str]) -> dict:
    resume_set = set(resume_skills)
    jd_set = set(jd_skills)

    matched = sorted(resume_set & jd_set)
    missing = sorted(jd_set - resume_set)  # required by JD, not in resume
    extra = sorted(resume_set - jd_set)    # in resume, not required by JD

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "extra_skills": extra,
    }