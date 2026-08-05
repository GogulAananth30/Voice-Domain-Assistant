from flask import Blueprint, request, jsonify

from backend.services.gemini_service import ask_gemini

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    question = data.get("message")

    answer = ask_gemini(question)

    return jsonify({
        "reply": answer
    })