import pymupdf
import re

def extract_text_from_pdf(file_path):
    doc = pymupdf.open(file_path)

    all_text = []

    for page in doc:
        text = page.get_text()

        if text.strip():
            all_text.append(text)

    doc.close()

    return "\n".join(all_text)

KNOWN_SKILLS = [
    "Python", "Java", "JavaScript", "TypeScript", "SQL", "C++", "C#","C"
    "React", "Next.js", "Node.js", "FastAPI", "Django", "Flask",
    "Docker", "Kubernetes", "AWS", "GCP", "Azure",
    "PostgreSQL", "MongoDB", "Redis",
    "Git", "CI/CD", "Machine Learning", "Deep Learning",
    "Natural Language Processing", "Computer Vision", "Data Science", "Data Analysis",
    "Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn",
    "TensorFlow", "PyTorch", "OpenCV", "Hugging Face","Blockchain", "Solidity", "Rust", "Go", "Swift", "Objective-C","Foundry", "Heroku", "Vercel", "Netlify", "Jenkins", "CircleCI", "Travis CI", "Ansible", "Terraform", "Prometheus", "Grafana", "ELK Stack", "Splunk", "Tableau", "Power BI", "Looker", "QlikView", "Snowflake", "BigQuery", "Redshift", "Data Warehouse", "ETL", "Data Pipeline"

]

KNOWN_SKILLS_SORTED = sorted(KNOWN_SKILLS, key=len, reverse=True)


def extract_skills(raw_text: str) -> list[str]:
    text = raw_text.lower()
    matched_skills = []

    for skill in KNOWN_SKILLS:
        escaped_skill = re.escape(skill.lower())

        # Don't use \b for skills ending/starting with non-word characters
        pattern = rf'(?<![\w+#.]){escaped_skill}(?![\w+#.])'

        if re.search(pattern, text):
            matched_skills.append(skill)

    return matched_skills

