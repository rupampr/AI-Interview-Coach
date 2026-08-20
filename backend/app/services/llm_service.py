import os
import json
import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

_model = genai.GenerativeModel("gemini-3.6-flash")


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

    response = _model.generate_content(prompt)
    raw_output = response.text.strip()

    # Gemini sometimes wraps output in ```json ... ``` despite instructions —
    # strip that defensively rather than trusting the prompt alone
    if raw_output.startswith("```"):
        raw_output = raw_output.strip("`")
        if raw_output.startswith("json"):
            raw_output = raw_output[4:]
        raw_output = raw_output.strip()

    try:
        questions = json.loads(raw_output)
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

    response = _model.generate_content(prompt)
    raw_output = response.text.strip()

    if raw_output.startswith("```"):
        raw_output = raw_output.strip("`")
        if raw_output.startswith("json"):
            raw_output = raw_output[4:]
        raw_output = raw_output.strip()

    try:
        evaluation = json.loads(raw_output)
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

    response = _model.generate_content(prompt)
    raw_output = response.text.strip()

    if raw_output.startswith("```"):
        raw_output = raw_output.strip("`")
        if raw_output.startswith("json"):
            raw_output = raw_output[4:]
        raw_output = raw_output.strip()

    try:
        result = json.loads(raw_output)
    except json.JSONDecodeError as e:
        raise ValueError(f"LLM did not return valid JSON: {e}\nRaw output: {raw_output}")

    required_keys = {"strengths", "weaknesses", "improvement_areas", "summary_text"}
    missing_keys = required_keys - result.keys()
    if missing_keys:
        raise ValueError(f"LLM response missing keys: {missing_keys}")

    return result