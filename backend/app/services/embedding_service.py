import os
import logging
import math
import hashlib

logger = logging.getLogger(__name__)


def generate_embedding(text: str) -> list[float]:
    """
    Converts text into an embedding vector using Google Gemini's embedding API.
    
    Why this approach:
    Using local PyTorch + SentenceTransformers requires >500MB of RAM, causing
    OutOfMemory (OOM) crashes on 512MB cloud instances (Render free tier, Railway starter).
    Gemini API embedding uses near 0 MB of local RAM and processes in milliseconds.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        # 1. Try modern google-genai SDK
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            for m_name in ["gemini-embedding-001", "gemini-embedding-2"]:
                try:
                    res = client.models.embed_content(
                        model=m_name,
                        contents=text[:2048],
                    )
                    if hasattr(res, "embeddings") and res.embeddings and len(res.embeddings) > 0:
                        return list(res.embeddings[0].values)
                except Exception as e:
                    logger.debug(f"google-genai embedding model {m_name} failed: {e}")
                    continue
        except ImportError:
            pass

        # 2. Try legacy google.generativeai SDK
        try:
            import google.generativeai as legacy_genai
            legacy_genai.configure(api_key=api_key)
            for m_name in ["models/gemini-embedding-001", "models/text-embedding-004"]:
                try:
                    result = legacy_genai.embed_content(
                        model=m_name,
                        content=text[:2048],
                        task_type="semantic_similarity",
                    )
                    if "embedding" in result:
                        return result["embedding"]
                except Exception as e:
                    logger.debug(f"legacy genai embedding model {m_name} failed: {e}")
                    continue
        except Exception as e:
            logger.warning(f"Legacy Google Gemini embedding failed: {e}")

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
