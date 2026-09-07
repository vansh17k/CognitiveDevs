"""
Interactive AI Assistant & Portal Guide Service (Python)
"""
import os
import json

try:
    from google import genai
    HAS_GENAI = True
except ImportError:
    genai = None
    HAS_GENAI = False

WEBSITE_FEATURE_KNOWLEDGE_BASE = """
You are the official AI Assistant & Portal Guide for the Legal Metrology Compliance & Inspection System (PCR-2011).
Your role is to guide Field Inspectors, Deputy General Managers (DGM), and Enforcement Officers through all features of the website:

1. **Visual Packaging Scanner & OCR (/scanner or Top Bar 'Scan Product')**:
   - Allows live camera snapshot or image upload of packaged commodities.
   - Extracts mandatory Rule 6 declarations (MRP, USP, Net Quantity, Country of Origin, Manufacturer, Batch, Date, Consumer Care).
   - Validates Rule 7 numeral heights / font sizes.
   - Automatically generates a compliance certificate and logs infractions.

2. **Deputy General Manager (DGM) & Inspector Requests Portal (/requests)**:
   - Inspector View: Field officers can file formal seizure requests, non-compliance summons, and Rule 6 complaints.
   - DGM View: Central Authority reviews all incoming inspector cases, enters statutory remarks, sets Section 36 compounding amounts, and issues Approved, Rejected, or Resolved compounding orders.
   - Live synchronization and audit trail.

3. **Number of Times of Violation by Product & Analytics (/violations)**:
   - Features the interactive 'Number of Times of Violation by Product' chart showing frequency of non-compliance per commodity.
   - Severity color grading (Rose: High >25, Amber: Moderate >10, Green: Compliant 0).
   - 7-day enforcement trend line and recent violation streams.

4. **Commodity Products Registry (/products)**:
   - Catalog of all registered packaged goods with real-time status badges (Compliant, Non-Compliant, Needs Review).
   - Category filtering (Dairy, Packaged Food, Personal Care, Detergents, Beverages).
   - Direct click to open detailed packaging audit reports.

5. **Historical Inspection Records & Audit Trail (/history)**:
   - Immutable audit logs of all scans, seizures, DGM decisions, and inspection certificates.

6. **Legal Metrology Act, 2009 & PCR-2011 Statutory Rules Handbook (Top Header 'Rules Reference')**:
   - Official reference for Rule 6(1)(a)-(n), Rule 7 font sizes, Rule 12 standard units, Section 36 compounding penalties (₹25,000 to ₹1,00,000).

7. **Role Switcher (Top Right Profile)**:
   - Switch between 'Inspector Rajesh Sharma (Field Officer)' and 'Dr. Anita Verma (DGM Central Authority)'.

INSTRUCTIONS:
- Give concise, clear, and friendly instructions.
- If the user asks how to perform a task, give step-by-step guidance.
- Always offer relevant quick action navigation suggestions (e.g. `[Navigate: Scanner]`, `[Navigate: Requests]`, `[Navigate: Violations]`, `[Navigate: Products]`, `[Navigate: History]`, `[Action: Open Rules]`).
"""

def generate_guide_response(user_message, history=None):
    """
    Generates intelligent guided answers using Gemini 2.5 Flash.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return get_fallback_guide_response(user_message)

    try:
        client = genai.Client(api_key=api_key)
        system_instruction = WEBSITE_FEATURE_KNOWLEDGE_BASE
        
        prompt = f"User asks: {user_message}\n\nPlease guide them clearly on how to use the website features."
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={
                "system_instruction": system_instruction,
                "temperature": 0.3
            }
        )
        return response.text
    except Exception as e:
        print(f"AI Guide Error: {e}")
        return get_fallback_guide_response(user_message)

def get_fallback_guide_response(user_message):
    q = user_message.lower()
    if 'scan' in q or 'camera' in q or 'ocr' in q or 'upload' in q:
        return (
            "📸 **Product Scanner & Visual Verification**:\n"
            "1. Click the green **'Scan Product'** button in the top navigation bar (or press `S`).\n"
            "2. Choose **Live Camera Capture**, **Upload Packaging Image**, or pick a **Demo Sample**.\n"
            "3. Our AI OCR scans mandatory Rule 6 declarations (MRP, Net Qty, Origin, Expiry, Consumer Care) and verifies font sizes under Rule 7.\n"
            "4. Review the instant Compliance Report and export the statutory violation notice!"
        )
    elif 'dgm' in q or 'request' in q or 'complaint' in q or 'seizure' in q:
        return (
            "🛡️ **DGM Review & Inspector Requests Portal**:\n"
            "1. Navigate to **Requests** in the top navigation.\n"
            "2. **As an Inspector**: Click *'Create New Request'* to file a field violation report with photo evidence.\n"
            "3. **As DGM**: Switch your role to *Dr. Anita Verma (DGM)* at the top right to review pending complaints, enter compounding penalty orders, and approve seizure summons."
        )
    elif 'violation' in q or 'chart' in q or 'product' in q:
        return (
            "📊 **Violations Summary & Product Infractions Chart**:\n"
            "1. Open the **Violations** tab to see the **Number of Times of Violation by Product** chart.\n"
            "2. View total infractions recorded for every commodity (e.g. Amul Milk, Maggi, Detergent).\n"
            "3. Toggle between *All Products* and *Violations Only*, or switch to the ranked List view."
        )
    elif 'rule' in q or 'fine' in q or 'penalty' in q or 'pcr' in q or 'act' in q:
        return (
            "⚖️ **Legal Metrology PCR-2011 Statutory Rules Reference**:\n"
            "1. Click the **'Rules Reference'** button in the header.\n"
            "2. Access the full handbook for Rule 6(1) mandatory declarations, Rule 7 numeral heights, and Section 36 penalties (up to ₹25,000 for first offence, ₹50,000 for second)."
        )
    else:
        return (
            "👋 **Welcome to the Legal Metrology PCR-2011 Enforcement Portal!**\n\n"
            "Here are the key features you can explore:\n"
            "• 📸 **Product Scanner**: Scan or upload packaging labels for instant AI Rule 6 & 7 compliance checks.\n"
            "• 🛡️ **DGM & Requests Portal**: File inspector complaints and issue DGM compounding orders.\n"
            "• 📊 **Violations Analytics**: View the 'Number of Times of Violation by Product' chart.\n"
            "• 📦 **Products Registry**: Browse all tested commodities and compliance statuses.\n"
            "• ⚖️ **Rules Handbook**: Search legal sections, font requirements, and statutory fines."
        )
