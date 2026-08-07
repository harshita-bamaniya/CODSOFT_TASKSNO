import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class GeminiService:

    def enhance_caption(self, base_caption: str):

        prompt = f"""
You are an expert AI copywriter.

Base caption:
{base_caption}

Create four unique captions based on the image.

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
- Rich descriptive paragraph
- Mention important visual details naturally.

Social:
- Instagram-ready
- Include relevant emojis
- Include 3–5 relevant hashtags
- Encourage engagement.

Return ONLY valid JSON.

{{
    "professional":"",
    "creative":"",
    "detailed":"",
    "social":""
}}
"""

       

        try:
            response = client.models.generate_content(
                model="gemini-flash-latest",
                contents=prompt,
            )

            ...

            if not response.text:
                raise Exception("Gemini returned an empty response.")

            print("Gemini Response:")
            

            return json.loads(response.text)

        except Exception as e:
            print("Gemini Error:")
            print(type(e).__name__)
            print(e)
            raise


gemini_service = GeminiService()