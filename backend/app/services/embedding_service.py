from sentence_transformers import SentenceTransformer

# Load the model once at module import time, not per-request —
# loading it fresh on every call would be extremely slow.
_model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text: str) -> list[float]:
    """
    Converts text into a 384-dimensional embedding vector.
    Returns a plain Python list (JSON-serializable) rather than
    a numpy array, since it needs to go into a JSON column.
    """
    embedding = _model.encode(text, convert_to_numpy=True)
    return embedding.tolist()