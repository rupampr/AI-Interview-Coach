import numpy as np


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    """
    Computes cosine similarity between two embedding vectors.
    Safely handles zero norms and length/dimension discrepancies.
    """
    if not vec_a or not vec_b:
        return 0.0

    len_a = len(vec_a)
    len_b = len(vec_b)

    if len_a != len_b:
        # Match dimensions by trimming to common length or re-sampling
        min_len = min(len_a, len_b)
        a = np.array(vec_a[:min_len], dtype=float)
        b = np.array(vec_b[:min_len], dtype=float)
    else:
        a = np.array(vec_a, dtype=float)
        b = np.array(vec_b, dtype=float)

    # Guard against zero vectors to avoid division by zero
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0

    similarity = float(np.dot(a, b) / (norm_a * norm_b))
    return max(0.0, min(1.0, similarity))


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