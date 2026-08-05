from flask import Blueprint, request, jsonify
from backend.services.gemini_service import ask_gemini

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    prompt = data.get("message")

    if not prompt:
        return jsonify({"error": "Message is required"}), 400

    reply = ask_gemini(prompt)

    return jsonify({
        "reply": reply
    })