import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

SYSTEM_PROMPT = """
You are Voice Domain Assistant, a professional AI assistant.

Rules:

- Answer naturally like a human assistant.
- Never use Markdown.
- Never use headings.
- Never use bullet points unless the user explicitly asks.
- Never use tables.
- Never use code blocks unless the user asks for code.
- Keep answers conversational.
- Keep most answers under 200 words.
- If the user asks for an explanation, explain clearly using short paragraphs.
- If the user asks for a definition, answer in 2-3 sentences.
- If the question is technical, provide accurate information without unnecessary details.
- If the answer contains numbered steps, speak them naturally instead of using Markdown formatting.
- Avoid repeating the user's question.
- End naturally without adding unnecessary closing sentences.
"""

def ask_gemini(user_prompt):

    prompt = f"""
{SYSTEM_PROMPT}

User:
{user_prompt}

Assistant:
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text