import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not configured.")

client = genai.Client(api_key=api_key)


class GeminiService:

    def enhance_caption(self, base_caption: str):

        prompt = f"""
You are an expert AI copywriter.

Base caption:
{base_caption}

Create four UNIQUE captions based on the base caption.

Requirements:

Professional:
- Formal
- Business tone
- Suitable for business, websites, or product catalogs.

Creative:
- Imaginative
- Storytelling
- Emotionally engaging.

Detailed:
- Rich descriptive paragraph.
- Mention important visual details naturally.

Social:
- Instagram-ready.
- Include relevant emojis.
- Include 3–5 relevant hashtags.
- Encourage engagement.

IMPORTANT:
- Each caption must be meaningfully different.
- Do not repeat the same sentence across categories.
- Return ONLY valid JSON.
- Do NOT use Markdown code fences.

Return exactly this JSON structure:

{{
    "professional": "",
    "creative": "",
    "detailed": "",
    "social": ""
}}
"""

        try:
            response = client.models.generate_content(
                model="gemini-flash-latest",
                contents=prompt,
            )

            if not response.text:
                raise Exception("Gemini returned an empty response.")

            raw_response = response.text.strip()

            print("Gemini Response:")
            print(raw_response)

            # Remove Markdown JSON code fences if Gemini adds them
            if raw_response.startswith("```json"):
                raw_response = raw_response[7:]

            if raw_response.startswith("```"):
                raw_response = raw_response[3:]

            if raw_response.endswith("```"):
                raw_response = raw_response[:-3]

            raw_response = raw_response.strip()

            captions = json.loads(raw_response)

            required_keys = [
                "professional",
                "creative",
                "detailed",
                "social",
            ]

            for key in required_keys:
                if key not in captions or not captions[key]:
                    raise Exception(
                        f"Gemini response is missing '{key}'."
                    )

            return captions

        except Exception as e:
            print("Gemini Error:")
            print(type(e).__name__)
            print(e)
            raise


gemini_service = GeminiService()