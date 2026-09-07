"""
Gemini Multimodal AI Service for Legal Metrology Verification (Python SDK)
"""
import os
import json

try:
    from google import genai
    from google.genai import types
    HAS_GENAI = True
except ImportError:
    genai = None
    types = None
    HAS_GENAI = False

def get_gemini_client():
    if not HAS_GENAI or genai is None:
        return None
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None
    try:
        return genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Error initializing Gemini client: {e}")
        return None

def analyze_package_image(image_bytes=None, image_base64=None, mime_type="image/jpeg"):
    """
    Analyzes packaging visual declarations via Gemini 2.5 Flash.
    """
    client = get_gemini_client()
    if not client:
        return None

    prompt = """
    You are an official Legal Metrology (Packaged Commodities) Rules, 2011 compliance verification officer in India.
    Inspect this product packaging image. Extract the mandatory declarations required under Rule 6 & Rule 7:

    1. Commodity Generic Name
    2. Net Quantity (including metric unit verification)
    3. Maximum Retail Price (MRP in INR) and whether 'Inclusive of all taxes' is present
    4. Unit Sale Price (USP) if applicable
    5. Manufacturer / Packer / Importer Name & Complete Address
    6. Country of Origin
    7. Month & Year of Manufacture / Packing
    8. Consumer Care Details (Phone / Email / Address)

    Return valid JSON with:
    {
      "product_name": "...",
      "brand": "...",
      "category": "...",
      "status": "Compliant" | "Non-Compliant" | "Needs Review",
      "extracted_text": "...",
      "declarations": [
        {"id": "d1", "name": "...", "status": "Compliant" | "Non-Compliant" | "Needs Review", "value": "...", "ruleReference": "..."}
      ],
      "violations": [
        {"id": "v1", "title": "...", "severity": "High" | "Medium" | "Low", "ruleReference": "...", "penalty": "...", "description": "..."}
      ],
      "recommendations": ["..."]
    }
    """

    try:
        content_parts = []
        if image_bytes:
            content_parts.append(types.Part.from_bytes(data=image_bytes, mime_type=mime_type))
        content_parts.append(prompt)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=content_parts,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Gemini Python SDK Vision Error: {e}")
        return None

def explain_violation(violation, product):
    """
    Generates statutory legal counsel summary and compounding breakdown for an infraction.
    """
    client = get_gemini_client()
    if not client:
        return None

    prompt = f"""
    Provide an official Legal Metrology statutory review for this violation:
    Product: {json.dumps(product)}
    Violation: {json.dumps(violation)}

    Provide:
    1. Legal Metrology Act, 2009 section & PCR 2011 rule reference
    2. Explanation of why this is a legal non-compliance
    3. Statutory Penalty & Compounding amount (Section 36 / Section 48)
    4. Recommended immediate action for Field Officer and DGM.
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Gemini Explain Violation Error: {e}")
        return None
