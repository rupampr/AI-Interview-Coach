import os
import json
import logging
import re

logger = logging.getLogger(__name__)


def call_gemini(prompt: str) -> str:
    """
    Calls Google Gemini using either google-genai or google.generativeai SDK.
    Gracefully handles whichever package is installed in the environment
    and falls back across model versions if a model is deprecated/404/503.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set. Please set it in your .env file or cloud environment.")

    preferred_model = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash-lite")
    models_to_try = [preferred_model]
    for m in [
        "gemini-3.5-flash-lite",
        "gemini-2.5-flash",
        "gemini-flash-latest",
        "gemini-3.5-flash",
        "gemini-flash-lite-latest",
        "gemini-3.8-flash",
    ]:
        if m not in models_to_try:
            models_to_try.append(m)

    last_error = None

    # 1. Try google-genai (modern official Google GenAI SDK)
    try:
        from google import genai as new_genai
        client = new_genai.Client(api_key=api_key)
        for m_name in models_to_try:
            try:
                response = client.models.generate_content(
                    model=m_name,
                    contents=prompt,
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                last_error = e
                logger.warning(f"Model {m_name} failed with google-genai: {e}. Trying next candidate...")
                continue
    except ImportError:
        pass

    # 2. Try google.generativeai (legacy SDK)
    try:
        import google.generativeai as legacy_genai
        legacy_genai.configure(api_key=api_key)
        for m_name in models_to_try:
            try:
                model = legacy_genai.GenerativeModel(m_name)
                response = model.generate_content(prompt)
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                last_error = e
                logger.warning(f"Model {m_name} failed with google.generativeai: {e}. Trying next candidate...")
                continue
    except ImportError:
        pass

    if last_error:
        raise last_error

    raise ModuleNotFoundError(
        "Neither 'google-genai' nor 'google-generativeai' is installed in this Python environment.\n"
        "Please run: pip install google-genai google-generativeai\n"
        "Or if using Docker, rebuild your container: docker compose up --build"
    )


def _clean_json_output(raw_output: str) -> str:
    """Helper to extract clean JSON string from LLM response, stripping code blocks."""
    cleaned = raw_output.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned)
    if match:
        cleaned = match.group(1).strip()
    elif cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
        cleaned = cleaned.strip()
    return cleaned


def generate_interview_questions(
    jd_text: str,
    matched_skills: list[str],
    missing_skills: list[str],
    interview_type: str,
    num_questions: int = 5,
) -> list[dict]:
    """
    Generates interview questions based on the job description, the
    candidate's skill gaps/matches, and the requested interview type.
    Returns a list of dicts:
    [{"question": str, "category": str, "difficulty": str}, ...]
    """

    prompt = f"""You are an expert interviewer preparing questions for a candidate.

Job description:
{jd_text}

The candidate's resume shows these matched skills (they already have these):
{", ".join(matched_skills) if matched_skills else "None identified"}

The candidate is missing these skills required by the job:
{", ".join(missing_skills) if missing_skills else "None identified"}

The requested interview type is: "{interview_type}"
(one of: technical, behavioral, dsa, hr — tailor the questions to match this type specifically)

Generate {num_questions} interview questions that:
- Match the "{interview_type}" interview type in style and content
- Prioritize probing the missing skills where relevant to this interview type
- Include at least 1-2 questions on matched skills, to verify depth of knowledge
- Are realistic questions an actual interviewer would ask for this role
- Vary in difficulty (mix of easy, medium, hard)

Respond with ONLY a valid JSON array, no markdown formatting, no code fences, no explanation.
Each item must have exactly these keys: "question", "category", "difficulty".
"category" must be one of: "dsa", "ml", "projects", "behavioral", "hr", "technical".
"difficulty" must be one of: "easy", "medium", "hard".

Example format:
[{{"question": "...", "category": "technical", "difficulty": "medium"}}]
"""

    raw_output = call_gemini(prompt)
    cleaned = _clean_json_output(raw_output)

    try:
        questions = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"LLM did not return valid JSON: {e}\nRaw output: {raw_output}")

    return questions


def evaluate_answer(question_text: str, answer_text: str, jd_text: str) -> dict:
    """
    Evaluates a candidate's answer against the question and job context.
    Returns a dict with technical_score, relevance_score, completeness_score,
    clarity_score, communication_score, overall_score (all 0-10 floats), and feedback (str).
    """

    prompt = f"""You are an expert interviewer evaluating a candidate's answer.

Job description context:
{jd_text}

Interview question:
{question_text}

Candidate's answer:
{answer_text}

Evaluate the answer on these five dimensions, each scored 0-10 (0 = very poor, 10 = excellent):
- technical_score: correctness and depth of technical content (if applicable; if the question is non-technical, judge appropriateness of content instead)
- relevance_score: how directly the answer addresses what was asked
- completeness_score: whether the answer covers the key points expected
- clarity_score: how clearly the answer is structured and explained
- communication_score: overall communication quality (tone, conciseness, professionalism)

Also compute an overall_score (0-10), and write 2-4 sentences of constructive feedback
the candidate could use to improve.

Respond with ONLY a valid JSON object, no markdown formatting, no code fences, no explanation.
Use exactly these keys: "technical_score", "relevance_score", "completeness_score",
"clarity_score", "communication_score", "overall_score", "feedback".
All score fields must be numbers (not strings), between 0 and 10.

Example format:
{{"technical_score": 7.5, "relevance_score": 8, "completeness_score": 6.5, "clarity_score": 8, "communication_score": 7, "overall_score": 7.4, "feedback": "..."}}
"""

    raw_output = call_gemini(prompt)
    cleaned = _clean_json_output(raw_output)

    try:
        evaluation = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"LLM did not return valid JSON: {e}\nRaw output: {raw_output}")

    required_keys = {
        "technical_score", "relevance_score", "completeness_score",
        "clarity_score", "communication_score", "overall_score", "feedback",
    }
    missing_keys = required_keys - evaluation.keys()
    if missing_keys:
        raise ValueError(f"LLM response missing keys: {missing_keys}")

    return evaluation


def generate_report_summary(qa_pairs: list[dict]) -> dict:
    """
    qa_pairs: list of {"question": str, "answer": str, "overall_score": float, "feedback": str, "category": str}
    Returns: {"strengths": list[str], "weaknesses": list[str], "improvement_areas": list[str], "summary_text": str}
    """

    qa_block = "\n\n".join(
        f"Q ({pair.get('category', 'general')}): {pair['question']}\n"
        f"A: {pair['answer']}\nScore: {pair['overall_score']}/10\nFeedback: {pair['feedback']}"
        for pair in qa_pairs
    )

    prompt = f"""You are reviewing a candidate's full mock interview performance.

Here are all the questions, answers, scores, and per-answer feedback from the session:

{qa_block}

Based on the full session, provide:
- strengths: a list of 2-4 short bullet points on what the candidate did well overall
- weaknesses: a list of 2-4 short bullet points on specific weaknesses observed
- improvement_areas: a list of 2-4 short, actionable recommendations for what to study/practice next
- summary_text: a 3-5 sentence overall performance summary

Respond with ONLY a valid JSON object, no markdown formatting, no code fences, no explanation.
Use exactly these keys: "strengths", "weaknesses", "improvement_areas", "summary_text".
"strengths", "weaknesses", and "improvement_areas" must be arrays of strings.
"summary_text" must be a single string.
"""

    raw_output = call_gemini(prompt)
    cleaned = _clean_json_output(raw_output)

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"LLM did not return valid JSON: {e}\nRaw output: {raw_output}")

    required_keys = {"strengths", "weaknesses", "improvement_areas", "summary_text"}
    missing_keys = required_keys - result.keys()
    if missing_keys:
        raise ValueError(f"LLM response missing keys: {missing_keys}")

    return result
