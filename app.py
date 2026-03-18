import os, json
from flask import Flask, request, jsonify, send_from_directory
import anthropic

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, static_folder=None)
client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
MODEL = "claude-sonnet-4-5"

@app.route("/")
def index():
    return send_from_directory(os.path.join(BASE_DIR, "templates"), "index.html")

@app.route("/static/<path:filename>")
def static_files(filename):
    return send_from_directory(os.path.join(BASE_DIR, "static"), filename)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message","").strip()
    event = data.get("event","general")
    difficulty = data.get("difficulty","medium")
    xp = data.get("xp",0)
    last_q = data.get("lastQuestion","")
    if not message:
        return jsonify({"error":"No message"}),400

    event_context = {
        "terminology":"Foundations of Medical Terminology",
        "nutrition":"Foundations of Nutrition",
        "math":"Math for Health Careers",
        "careers":"Health Career Exploration",
        "emergency":"Life Threatening Situations",
        "healthy_living":"Foundations of Healthy Living",
        "hosa_bowl":"Foundations of HOSA Bowl"
    }.get(event, "HOSA general knowledge")

    system = f"""You are Dr. Morph, an enthusiastic AI tutor in the HOSA Academy app for middle school HOSA competitors.

Current event: {event_context}
Difficulty: {difficulty}
Student XP: {xp}
Last question: "{last_q}"

Rules:
- Keep responses SHORT (2-4 sentences max)
- Be encouraging, fun, and accurate
- Use health/medical emoji occasionally 🔬🧬🩺💉🧪
- Give memory tricks when students struggle
- Stay focused on the current HOSA competitive event topic
- If asked about a different event, redirect helpfully"""

    response = client.messages.create(
        model=MODEL, max_tokens=200,
        system=system,
        messages=[{"role":"user","content":message}]
    )
    return jsonify({"reply": response.content[0].text})

if __name__ == "__main__":
    port = int(os.environ.get("PORT",5000))
    app.run(host="0.0.0.0", port=port, debug=False)
