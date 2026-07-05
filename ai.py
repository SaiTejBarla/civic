import os
import json
import mimetypes

from dotenv import load_dotenv
from google import genai
from google.genai import types

# ----------------------------------------------------
# Load Environment Variables
# ----------------------------------------------------

load_dotenv()

# ----------------------------------------------------
# Configure Gemini
# ----------------------------------------------------

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=API_KEY)

# ----------------------------------------------------
# AI Prompt
# ----------------------------------------------------

PROMPT = """
You are an expert AI Public Infrastructure Inspector.

Analyze the uploaded infrastructure image(s) carefully.

The user may upload between 1 and 7 images of the SAME infrastructure issue.

The images may include:
- Different viewing angles
- Close-up shots
- Wide-angle shots
- Different lighting conditions
- Different distances

Treat ALL uploaded images as a SINGLE report.

Use information from every image before making your decision.

If there is conflicting information, choose the most probable infrastructure issue.

Return ONLY a valid JSON object.

Do NOT use markdown.
Do NOT use triple backticks.
Do NOT include explanations.
Do NOT include any text before or after the JSON.

Return this exact schema:

{
  "issue": "",
  "category": "",
  "severity": "",
  "priority": "",
  "department": "",
  "confidence": "",
  "summary": "",
  "recommendation": ""
}

Possible Issues:
- Pothole
- Road Crack
- Broken Streetlight
- Open Manhole
- Water Leakage
- Garbage Overflow
- Broken Traffic Signal
- Fallen Tree
- Damaged Footpath
- Missing Road Sign
- Missing Highway Reflector
- Damaged Bus Stop
- Broken Utility Pole
- Broken Bridge
- Drainage Blockage
- Other

Categories:
- Road Infrastructure
- Traffic Infrastructure
- Electrical Infrastructure
- Water Infrastructure
- Public Transport
- Bridges
- Parks & Public Spaces
- Public Safety
- Other

Departments:
- Roads
- Traffic
- Electrical
- Water Supply
- Drainage
- Sanitation
- Bridges
- Parks & Horticulture
- Public Works

Severity:
Low
Medium
High
Critical

Priority:
Low
Medium
High
Critical

Confidence:
Return percentage only.
Example:
96%

Summary:
Maximum two sentences.

Recommendation:
One practical action.
"""

# ----------------------------------------------------
# AI Analysis
# ----------------------------------------------------

def analyze_images(image_paths):

    if not image_paths:
        raise Exception("No images provided.")

    if len(image_paths) > 7:
        raise Exception("Maximum 7 images are allowed.")

    contents = [PROMPT]

    for image_path in image_paths:

        if not os.path.exists(image_path):
            raise Exception(f"Image not found: {image_path}")

        mime_type, _ = mimetypes.guess_type(image_path)

        if mime_type is None:
            mime_type = "image/jpeg"

        with open(image_path, "rb") as f:
            image_bytes = f.read()

        contents.append(
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type
            )
        )

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents
        )

        text = response.text.strip()

        if text.startswith("```"):
            text = (
                text.replace("```json", "")
                .replace("```", "")
                .strip()
            )

        print("\n========== GEMINI RESPONSE ==========")
        print(text)
        print("=====================================\n")

        return json.loads(text)

    except json.JSONDecodeError:

        raise Exception(
            f"Gemini returned invalid JSON:\n\n{text}"
        )

    except Exception as e:

        raise Exception(f"Gemini Error: {str(e)}")
# ----------------------------------------------------
# Analytics AI Insights
# ----------------------------------------------------

def generate_analytics_insights(reports):

    if not reports:
        return "No reports available for analysis."

    category_counts = {}
    status_counts = {}

    for report in reports:

        category = report.get("category", "Unknown")
        status = report.get("status", "Unknown")

        category_counts[category] = category_counts.get(category, 0) + 1
        status_counts[status] = status_counts.get(status, 0) + 1

    prompt = f"""
You are an AI assistant for a smart city civic complaint system.

Below are complaint statistics.

Categories:
{json.dumps(category_counts, indent=2)}

Statuses:
{json.dumps(status_counts, indent=2)}

Generate 3 to 5 short insights.

Requirements:
- Keep each insight on a separate line.
- Mention important trends.
- Mention the most reported category.
- Mention complaint resolution status if relevant.
- Suggest one practical recommendation.
- Do not use markdown.
- Do not return JSON.
"""

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text.strip()

    except Exception as e:

        raise Exception(f"Gemini Error: {str(e)}")
# ----------------------------------------------------
# Local Test
# ----------------------------------------------------

if __name__ == "__main__":

    sample_images = [
        "bad_sanitation.jpg",
        "broken_bridge.jpg",
        "broken_pole.jpg",
        "broken_road_sign.jpg",
        "images.jpg",
        "water_underflow.jpg"
    ]

    existing_images = [
        img for img in sample_images if os.path.exists(img)
    ]

    if not existing_images:
        print("No sample images found.")
    else:
        try:
            result = analyze_images(existing_images)

            print("\n========== FINAL JSON ==========")
            print(json.dumps(result, indent=4))
            print("================================\n")

        except Exception as e:
            print(e)