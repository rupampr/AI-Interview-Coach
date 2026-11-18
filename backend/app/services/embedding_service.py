import os
import logging
import math
import hashlib

logger = logging.getLogger(__name__)


def generate_embedding(text: str) -> list[float]:
    """
    Converts text into an embedding vector using Google Gemini's text-embedding-004 API.
    
    Why this approach:
    Using local PyTorch + SentenceTransformers requires >500MB of RAM, causing
    OutOfMemory (OOM) crashes on 512MB cloud instances (Render free tier, Railway starter).
    Gemini API embedding uses near 0 MB of local RAM and processes in milliseconds.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=text[:2048],
                task_type="semantic_similarity",
            )
            return result["embedding"]
        except Exception as e:
            logger.warning(f"Google Gemini embedding failed: {e}. Using lightweight fallback vector.")

    # Lightweight deterministic hashing fallback (0 MB memory overhead)
    # Generates a normalized 128-dimensional vector if API is unreachable or during tests
    dim = 128
    vector = [0.0] * dim
    words = text.lower().split()
    if not words:
        return vector

    for word in words:
        bucket = int(hashlib.md5(word.encode("utf-8")).hexdigest(), 16) % dim
        vector[bucket] += 1.0

    norm = math.sqrt(sum(x * x for x in vector))
    if norm > 0:
        vector = [x / norm for x in vector]

    return vector
