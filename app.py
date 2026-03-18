import os
import json
from flask import Flask, request, jsonify, send_from_directory
import anthropic

app = Flask(__name__)
client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
MODEL = "claude-sonnet-4-5"

@app.route("/")
def index():
    return send_from_directory("templates", "index.html")

@app.route("/static/<path:filename>")
def static_files(filename):
    return send_from_directory("static", filename)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "").strip()
    difficulty = data.get("difficulty", "medium")
    current_screen = data.get("currentScreen", "home")
    last_question = data.get("lastQuestion", "")
    xp = data.get("xp", 0)

    if not message:
        return jsonify({"error": "No message provided"}), 400

    system_prompt = f"""You are Dr. Morph, an enthusiastic but concise AI tutor inside a medical terminology game app for 8th graders preparing for the HOSA Foundations of Medical Terminology event.

Keep responses SHORT (2-4 sentences max). Be encouraging, fun, and educational.
Current difficulty: {difficulty}
Current screen/game: {current_screen}
Last question context: "{last_question}"
Student XP: {xp}

If asked to change difficulty, confirm it and be encouraging.
Use medical emoji occasionally (🔬 🧬 🩺 💉 🧪).
Never be preachy. Focus on medical terminology concepts — prefixes, roots, suffixes, body systems.
If a student gets something wrong, give a quick memory trick to help them remember."""

    response = client.messages.create(
        model=MODEL,
        max_tokens=200,
        system=system_prompt,
        messages=[{"role": "user", "content": message}]
    )

    reply = response.content[0].text
    return jsonify({"reply": reply})


@app.route("/analyze-source", methods=["POST"])
def analyze_source():
    data = request.get_json()
    source_text = data.get("text", "").strip()

    if not source_text:
        return jsonify({"error": "No source text provided"}), 400

    system_prompt = """You are an HOSA medical terminology expert. Analyze the provided study material and extract key medical terms, prefixes, roots, and suffixes.

Return ONLY a valid JSON object with NO markdown, NO backticks, NO preamble. Structure:
{
  "title": "short descriptive title for this source",
  "summary": "1-2 sentence summary of what was covered",
  "terms": [
    {"term": "cardio", "type": "root", "meaning": "heart", "example": "cardiology"},
    {"term": "-itis", "type": "suffix", "meaning": "inflammation", "example": "arthritis"}
  ]
}

Types must be one of: prefix, root, suffix, full_term
Extract as many terms as possible, up to 30."""

    response = client.messages.create(
        model=MODEL,
        max_tokens=1500,
        system=system_prompt,
        messages=[{"role": "user", "content": f"Analyze this medical terminology source:\n\n{source_text[:4000]}"}]
    )

    raw = response.content[0].text.strip()

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        clean = raw.replace("```json", "").replace("```", "").strip()
        try:
            parsed = json.loads(clean)
        except json.JSONDecodeError:
            parsed = {
                "title": "Custom Source",
                "summary": "Source added successfully.",
                "terms": []
            }

    return jsonify(parsed)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
