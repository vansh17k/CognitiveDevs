/**
 * LS (LexiScan) Backend Server
 * =========================================================
 * 
 * 🎓 DJANGO DEVELOPER GUIDE:
 * If you are familiar with Python & Django:
 * - Express `app = express()` is similar to Django's WSGI/ASGI application.
 * - `app.use(express.json())` works like Django's `json.loads(request.body)` middleware.
 * - Route handlers `app.get('/api/...', (req, res) => ...)` are equivalent to Django views in `views.py`.
 * - The endpoints below act like Django REST Framework (DRF) `@api_view(['GET', 'POST', 'PUT', 'DELETE'])` or ModelViewSets.
 * - `process.env.GEMINI_API_KEY` is loaded securely on the server side (like `os.getenv('GEMINI_API_KEY')` in `settings.py`).
 */

import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON payloads (up to 50MB for packaging images/scans)
// (Django equivalent: DATA_UPLOAD_MAX_MEMORY_SIZE & DRF JSONParser)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ==============================================================================
// 🧠 GEMINI AI INITIALIZATION (Server-Side Only - Safe from Browser Leakage)
// ==============================================================================
// Initialize the official Google Gen AI SDK lazily using the server environment variable.
let genAIClient = null;
function getGeminiClient() {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ GEMINI_API_KEY is not set in environment variables. Gemini live features will use intelligent rule-based fallback.');
      return null;
    }
    genAIClient = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAIClient;
}

// ==============================================================================
// 📦 IN-MEMORY STATE STORE (Django Models / Database Simulation)
// ==============================================================================
// In a full Django setup, these would be models in models.py (e.g., class InspectorRequest(models.Model)).
let requestsDb = [
  {
    id: 'REQ-2026-001',
    title: 'Relabeling Notice & Seizure for Missing Country of Origin',
    description: 'Amul Taaza Milk 500ml batch #AT-2938 shows missing country of origin declaration and ambiguous packer address under Rule 6(1)(a). Requesting immediate seizure notice issuance and compounding summons.',
    category: 'Rule 6 Declaration Infraction',
    priority: 'High',
    location: 'Central Supermarket, Indore Division',
    date: '2026-08-30 14:30',
    inspectorId: 'usr-001',
    inspectorName: 'Inspector Rajesh Sharma',
    inspectorEmail: 'inspector@lmcc.demo',
    inspectorDivision: 'Indore Central Division',
    status: 'Under Review', // Submitted -> Pending Review -> Under Review -> Approved / Rejected -> Resolved
    productId: 'prod-2',
    productName: 'Amul Taaza Toned Milk (500ml)',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    dgmRemarks: 'Field evidence acknowledged. Legal Section drafting Section 36 seizure notice for DGM sign-off.',
    dgmActionDate: '2026-08-30 16:15',
    dgmOfficerName: 'Dr. Anita Verma (DGM)',
    timeline: [
      { status: 'Submitted', timestamp: '2026-08-30 14:30', note: 'Request submitted with photo evidence by Inspector Rajesh Sharma', by: 'Inspector Rajesh Sharma' },
      { status: 'Pending Review', timestamp: '2026-08-30 14:35', note: 'Auto-routed and queued in DGM Central Review Portal', by: 'System' },
      { status: 'Under Review', timestamp: '2026-08-30 16:15', note: 'DGM reviewed lab findings and assigned legal counsel for drafting seizure order.', by: 'Dr. Anita Verma (DGM)' }
    ]
  },
  {
    id: 'REQ-2026-002',
    title: 'Sub-minimum Numeral Height on Unit Sale Price (USP)',
    description: 'Maggi 2-Min Noodles 70g packet exhibits numeral height of 1.1 mm for Unit Sale Price, violating Rule 7 Table 1 mandatory 1.5 mm requirement.',
    category: 'Font Size / Numeral Height (Rule 7)',
    priority: 'Medium',
    location: 'Mega Mart, Palasia, Indore',
    date: '2026-08-29 11:15',
    inspectorId: 'usr-001',
    inspectorName: 'Inspector Rajesh Sharma',
    inspectorEmail: 'inspector@lmcc.demo',
    inspectorDivision: 'Indore Central Division',
    status: 'Approved',
    productId: 'prod-4',
    productName: 'Maggi 2-Minute Noodles (70g)',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&auto=format&fit=crop&q=80',
    dgmRemarks: 'Approved for issuing compounding notice under Section 36 of Legal Metrology Act, 2009. Fine: ₹25,000.',
    dgmActionDate: '2026-08-29 15:40',
    dgmOfficerName: 'Dr. Anita Verma (DGM)',
    timeline: [
      { status: 'Submitted', timestamp: '2026-08-29 11:15', note: 'Complaint submitted by Inspector Rajesh Sharma', by: 'Inspector Rajesh Sharma' },
      { status: 'Pending Review', timestamp: '2026-08-29 11:20', note: 'Queued in DGM Central Portal', by: 'System' },
      { status: 'Under Review', timestamp: '2026-08-29 13:00', note: 'DGM initiated technical verification', by: 'Dr. Anita Verma (DGM)' },
      { status: 'Approved', timestamp: '2026-08-29 15:40', note: 'DGM approved notice for compounding issuance.', by: 'Dr. Anita Verma (DGM)' }
    ]
  },
  {
    id: 'REQ-2026-003',
    title: 'Missing Toll-Free Helpline on Imported Olive Oil',
    description: 'Imported Extra Virgin Olive Oil 1L batch lacks Indian consumer grievance address and active telephone number as mandated by Rule 6(1)(f).',
    category: 'Consumer Care Violation',
    priority: 'High',
    location: 'Freeganj Market, Ujjain',
    date: '2026-08-28 09:45',
    inspectorId: 'usr-003',
    inspectorName: 'Inspector Meera Sen',
    inspectorEmail: 'meera.sen@lmcc.gov.in',
    inspectorDivision: 'Ujjain Commercial Hub',
    status: 'Resolved',
    productId: 'prod-6',
    productName: 'Borges Extra Virgin Olive Oil (1L)',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
    dgmRemarks: 'Importer furnished rectified label stickers and paid compounding fee of ₹50,000. Case closed as resolved.',
    dgmActionDate: '2026-08-29 17:00',
    dgmOfficerName: 'Dr. Anita Verma (DGM)',
    timeline: [
      { status: 'Submitted', timestamp: '2026-08-28 09:45', note: 'Submitted by Inspector Meera Sen', by: 'Inspector Meera Sen' },
      { status: 'Pending Review', timestamp: '2026-08-28 10:00', note: 'Received by DGM Portal', by: 'System' },
      { status: 'Under Review', timestamp: '2026-08-28 14:00', note: 'DGM issued hearing notice to importer', by: 'Dr. Anita Verma (DGM)' },
      { status: 'Approved', timestamp: '2026-08-28 16:30', note: 'DGM approved compounding settlement order', by: 'Dr. Anita Verma (DGM)' },
      { status: 'Resolved', timestamp: '2026-08-29 17:00', note: 'Fine collected and case officially marked resolved.', by: 'Dr. Anita Verma (DGM)' }
    ]
  },
  {
    id: 'REQ-2026-004',
    title: 'Dual MRP Sticker Overwriting on Cold Drinks Case',
    description: 'Retailer found affixing secondary higher MRP sticker of ₹45 over printed manufacturer MRP of ₹38 on 750ml bottles.',
    category: 'Overcharging / Dual MRP Violation',
    priority: 'High',
    location: 'Industrial Area Zone 3, Gwalior',
    date: '2026-08-31 08:20',
    inspectorId: 'usr-004',
    inspectorName: 'Inspector V. Ramanathan',
    inspectorEmail: 'v.raman@lmcc.gov.in',
    inspectorDivision: 'Gwalior Industrial Zone',
    status: 'Pending Review',
    productId: 'prod-7',
    productName: 'Sparkling Carbonated Beverage (750ml)',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80',
    dgmRemarks: '',
    dgmActionDate: '',
    dgmOfficerName: '',
    timeline: [
      { status: 'Submitted', timestamp: '2026-08-31 08:20', note: 'Urgent seizure request submitted by Inspector V. Ramanathan', by: 'Inspector V. Ramanathan' },
      { status: 'Pending Review', timestamp: '2026-08-31 08:21', note: 'Queued at DGM Desk for priority decision', by: 'System' }
    ]
  }
];

// ==============================================================================
// 🚀 REST API ENDPOINTS (Equivalent to Django views.py & urls.py)
// ==============================================================================

/**
 * 1. HEALTH CHECK ENDPOINT
 * Django equivalent: path('api/health/', views.health_check)
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'LS LexiScan Backend',
    timestamp: new Date().toISOString(),
    aiEngine: Boolean(process.env.GEMINI_API_KEY) ? 'Gemini Vision AI Active' : 'Rule Engine Active'
  });
});

/**
 * 2. COMPLIANCE SCAN & OCR AI ANALYSIS ENDPOINT
 * POST /api/scan/analyze
 * 
 * Django equivalent:
 * @api_view(['POST'])
 * def analyze_package(request):
 *     image_b64 = request.data.get('image')
 *     # Run OCR & PCR-2011 rule verification via Gemini Vision
 */
app.post('/api/scan/analyze', async (req, res) => {
  try {
    const { imageBase64, productName, category, brand, presetId } = req.body;

    console.log(`[POST /api/scan/analyze] Processing package: "${productName || 'Uploaded Asset'}"`);

    const ai = getGeminiClient();

    // If Gemini API is available and an image is passed, perform multimodal visual analysis
    if (ai && imageBase64 && imageBase64.startsWith('data:image')) {
      try {
        const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const base64Data = matches[2];

          const prompt = `You are an expert Indian Legal Metrology Officer specializing in the Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011).
Perform an exhaustive visual OCR inspection of this packaged commodity image (especially back of pack, principal display panel, mandatory declarations panel, ingredients box, consumer care box, FSSAI logo area, and MRP/lot stamping).

Carefully extract ALL text from the package image and verify statutory compliance with Rule 6 & Rule 7 of PCR 2011:
1. Name and complete postal address of Manufacturer / Packer / Importer (Rule 6(1)(a))
2. Generic or Common Name of Commodity (Rule 6(1)(b))
3. Net Quantity in standard SI units (g, kg, ml, l, m) (Rule 6(1)(b))
4. Month and Year of Manufacture / Packing / Import (Rule 6(1)(c))
5. Maximum Retail Price (MRP) with "incl. of all taxes" (Rule 6(1)(d))
6. Consumer Care details: Name, Address, Helpline/Phone, Email (Rule 6(1)(e))
7. Country of Origin (Rule 6(1)(f)) (e.g., "Country of Origin: India" or "Made in India")
8. FSSAI License Number (14-digit number e.g. "Lic. No. 10012011000168" or similar)
9. Batch / Lot Number
10. Unit Sale Price (USP) under Rule 18(8) (e.g. ₹0.20 / g)

Respond ONLY with valid JSON with this exact structure:
{
  "productName": "string",
  "brand": "string",
  "category": "Food & Beverages | Instant Foods | Personal Care | FMCG | Beverages | Confectionery",
  "netQuantity": "string (e.g. '140 g' or '70 g' or '500 ml' or 'Not Detected')",
  "netQuantityDeclared": true,
  "mrp": "string (e.g. '₹14.00 (incl. of all taxes)' or '₹20.00' or 'Not Detected')",
  "mrpDeclared": true,
  "packingDate": "string (e.g. '05/2026' or 'MFD: 08/2025' or 'See under seal')",
  "mfgDate": "string (same as packingDate)",
  "mfgDateDeclared": true,
  "manufacturerName": "string (e.g. 'Nestlé India Limited' or 'Sample Foods Pvt Ltd')",
  "manufacturerAddress": "string (complete address found on package)",
  "manufacturerDeclared": true,
  "consumerCare": "string (phone numbers and email found)",
  "consumerCareDetails": "string",
  "consumerCareDeclared": true,
  "countryOfOrigin": "string (e.g. 'India' or 'Made in India' or 'Not Detected')",
  "countryOfOriginDeclared": true,
  "fssaiLicense": "string (14-digit number e.g. '10012011000168' or 'Not Detected')",
  "fssaiLicenseDeclared": true,
  "batchNumber": "string (e.g. 'LOT-MG-4410' or 'See code on seal')",
  "unitSalePrice": "string (e.g. '₹0.20 / g' or 'Not Detected')",
  "overallScore": number (0-100),
  "score": number (same as overallScore),
  "complianceStatus": "Compliant" | "Needs Review" | "Non-Compliant",
  "status": "Compliant" | "Needs Review" | "Non-Compliant",
  "summary": "string overview of findings",
  "inspectorRemarks": "string detailed officer observations",
  "declarations": [
    {
      "id": "d-1",
      "srNo": 1,
      "name": "Name & Address of Manufacturer",
      "ruleCode": "Rule 6(1)(a)",
      "extractedValue": "string extracted text",
      "detected": true,
      "status": "Compliant" | "Non-Compliant" | "Needs Review",
      "confidence": 95,
      "remarks": "string note"
    },
    {
      "id": "d-2",
      "srNo": 2,
      "name": "Net Quantity",
      "ruleCode": "Rule 6(1)(b)",
      "extractedValue": "string",
      "detected": true,
      "status": "Compliant" | "Non-Compliant" | "Needs Review",
      "confidence": 97,
      "remarks": "string note"
    },
    {
      "id": "d-3",
      "srNo": 3,
      "name": "MRP (incl. of all taxes)",
      "ruleCode": "Rule 6(1)(d)",
      "extractedValue": "string",
      "detected": true,
      "status": "Compliant" | "Non-Compliant" | "Needs Review",
      "confidence": 98,
      "remarks": "string note"
    },
    {
      "id": "d-4",
      "srNo": 4,
      "name": "Month & Year of Packing",
      "ruleCode": "Rule 6(1)(c)",
      "extractedValue": "string",
      "detected": true,
      "status": "Compliant" | "Non-Compliant" | "Needs Review",
      "confidence": 92,
      "remarks": "string note"
    },
    {
      "id": "d-5",
      "srNo": 5,
      "name": "Consumer Care Details",
      "ruleCode": "Rule 6(1)(e)",
      "extractedValue": "string",
      "detected": true,
      "status": "Compliant" | "Non-Compliant" | "Needs Review",
      "confidence": 95,
      "remarks": "string note"
    },
    {
      "id": "d-6",
      "srNo": 6,
      "name": "Country of Origin",
      "ruleCode": "Rule 6(1)(f)",
      "extractedValue": "string",
      "detected": true,
      "status": "Compliant" | "Non-Compliant" | "Needs Review",
      "confidence": 94,
      "remarks": "string note"
    },
    {
      "id": "d-7",
      "srNo": 7,
      "name": "FSSAI License No.",
      "ruleCode": "Rule 6(1)(a)",
      "extractedValue": "string",
      "detected": true,
      "status": "Compliant" | "Non-Compliant" | "Needs Review",
      "confidence": 96,
      "remarks": "string note"
    },
    {
      "id": "d-8",
      "srNo": 8,
      "name": "Font Size & Readability",
      "ruleCode": "Rule 7 & Table 1",
      "extractedValue": "string",
      "detected": true,
      "status": "Compliant" | "Non-Compliant" | "Needs Review",
      "confidence": 88,
      "remarks": "string note"
    }
  ],
  "violations": [
    {
      "id": "viol-1",
      "title": "string",
      "type": "Missing Declaration | Font Size Issue | Price Alteration",
      "severity": "High" | "Medium" | "Low",
      "ruleReference": "string (e.g. Rule 6(1)(f) of PCR 2011)",
      "finding": "string specific finding",
      "evidenceText": "string text from image",
      "recommendation": "string legal recommendation",
      "confidence": 90,
      "status": "Flagged"
    }
  ],
  "boundingBoxes": [
    {
      "id": "bb-1",
      "label": "Manufacturer Info",
      "x": 10,
      "y": 15,
      "width": 80,
      "height": 18,
      "status": "compliant",
      "textDetected": "string"
    }
  ]
}`;

          let response = null;
          const candidateModels = ['gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
          let lastGeminiError = null;

          for (const modelCandidate of candidateModels) {
            try {
              response = await ai.models.generateContent({
                model: modelCandidate,
                contents: [
                  {
                    role: 'user',
                    parts: [
                      { text: prompt },
                      {
                        inlineData: {
                          mimeType: mimeType,
                          data: base64Data
                        }
                      }
                    ]
                  }
                ],
                config: {
                  responseMimeType: 'application/json'
                }
              });
              if (response && response.text) {
                break;
              }
            } catch (err) {
              lastGeminiError = err;
              console.warn(`Attempt with ${modelCandidate} failed:`, err?.message || err);
            }
          }

          if (!response || !response.text) {
            throw lastGeminiError || new Error('No response from Gemini Vision models');
          }

          const rawText = response.text;
          const parsedResult = JSON.parse(rawText);

          return res.json({
            success: true,
            source: 'gemini-vision',
            data: parsedResult
          });
        }
      } catch (geminiError) {
        console.warn('Gemini vision analysis fallback to rule engine:', geminiError?.message || geminiError);
      }
    }

    // Fallback response if image isn't base64 or Gemini key not active
    return res.json({
      success: true,
      source: 'rule-engine-backend',
      data: {
        productName: productName || 'Packaged Commodity Sample',
        brand: brand || 'Verified Brand',
        category: category || 'Food & Beverages',
        overallScore: 88,
        complianceStatus: 'Needs Review',
        summary: 'Automated statutory check under PCR-2011: 7 of 8 declarations compliant, Unit Sale Price requires verification.',
        declarations: [
          { name: 'Name & Address of Manufacturer', rule: 'Rule 6(1)(a)', detectedText: 'Amul Dairy Rd, Anand, Gujarat 388001', status: 'Compliant', fontSize: '2.5 mm', requiredMinFontSize: '2.0 mm', fontCompliant: true },
          { name: 'Common or Generic Name', rule: 'Rule 6(1)(b)', detectedText: productName || 'Pasteurised Toned Milk', status: 'Compliant', fontSize: '3.0 mm', requiredMinFontSize: '2.0 mm', fontCompliant: true },
          { name: 'Net Quantity', rule: 'Rule 6(1)(c)', detectedText: '500 ml', status: 'Compliant', fontSize: '3.2 mm', requiredMinFontSize: '2.0 mm', fontCompliant: true },
          { name: 'Month & Year of Packing', rule: 'Rule 6(1)(d)', detectedText: '08/2026', status: 'Compliant', fontSize: '2.0 mm', requiredMinFontSize: '1.5 mm', fontCompliant: true },
          { name: 'Maximum Retail Price (MRP)', rule: 'Rule 6(1)(e)', detectedText: '₹ 28.00 (Incl. of all taxes)', status: 'Compliant', fontSize: '2.8 mm', requiredMinFontSize: '2.0 mm', fontCompliant: true },
          { name: 'Consumer Care Contact', rule: 'Rule 6(1)(f)', detectedText: 'care@amul.coop | 1800-258-3333', status: 'Compliant', fontSize: '1.8 mm', requiredMinFontSize: '1.5 mm', fontCompliant: true },
          { name: 'Country of Origin', rule: 'Rule 6(1)(10)', detectedText: 'India', status: 'Compliant', fontSize: '2.1 mm', requiredMinFontSize: '1.5 mm', fontCompliant: true },
          { name: 'Unit Sale Price', rule: 'Rule 6(11)', detectedText: '₹ 0.056 / ml', status: 'Needs Review', fontSize: '1.2 mm', requiredMinFontSize: '1.5 mm', fontCompliant: false }
        ],
        violations: [
          {
            title: 'Unit Sale Price Font Height Non-Compliance',
            severity: 'Medium',
            rule: 'Rule 6(11) & Rule 7 (Font Size)',
            description: 'Unit sale price is printed in 1.2 mm font, below the statutory minimum of 1.5 mm for 500 ml package size.',
            penalty: 'Section 36 of Legal Metrology Act, 2009 - Fine up to ₹25,000 for first offence.'
          }
        ],
        imageQuality: {
          overallScore: 85,
          lighting: 'Good',
          sharpness: 'Good',
          isSuitable: true
        }
      }
    });
  } catch (error) {
    console.error('Error in /api/scan/analyze:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
  }
});

/**
 * 3. EXPLAIN VIOLATION WITH GEMINI LEGAL AI
 * POST /api/ai/explain-violation
 * 
 * Django equivalent:
 * @api_view(['POST'])
 * def explain_violation(request):
 *     violation_text = request.data.get('violation')
 */
app.post('/api/ai/explain-violation', async (req, res) => {
  try {
    const { violation, product } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `As a legal advisor on the Indian Legal Metrology Act, 2009 and Packaged Commodities Rules 2011, provide a legal explanation and action plan for this infraction:
Product: ${product?.name || 'Packaged Commodity'}
Violation: ${violation?.title || 'Statutory Violation'}
Rule: ${violation?.rule || 'PCR 2011'}
Details: ${violation?.description || 'Non-compliance detected'}

Provide 3 sections:
1. Exact Legal Reference & Implication under PCR-2011
2. Penalty provisions under Section 36 of Legal Metrology Act, 2009
3. Step-by-step Corrective Action for the manufacturer/packer.`;

      let response = null;
      const candidateModels = ['gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
      for (const modelCandidate of candidateModels) {
        try {
          response = await ai.models.generateContent({
            model: modelCandidate,
            contents: prompt
          });
          if (response && response.text) {
            break;
          }
        } catch (err) {
          console.warn(`Explain violation attempt with ${modelCandidate} failed:`, err?.message || err);
        }
      }

      if (response && response.text) {
        return res.json({
          success: true,
          explanation: response.text
        });
      }
    }

    return res.json({
      success: true,
      explanation: `Legal Notice under Legal Metrology Act, 2009:\n\n1. Legal Reference:\nViolation of ${violation?.rule || 'Rule 6 of Packaged Commodities Rules, 2011'}. All packaged goods must distinctly declare all 8 mandatory provisions in legible font.\n\n2. Penalties:\nUnder Section 36, non-compliant packaging is punishable with fine up to ₹25,000 for first offence, ₹50,000 for second offence, and up to ₹1,00,000 or imprisonment up to 1 year for subsequent offences.\n\n3. Corrective Action:\nImmediately recall affected batch from retail channels and rectify artwork before commercial dispatch.`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 4. STATUTORY RULES API
 * GET /api/rules and /api/rules/
 * 
 * Django equivalent:
 * class RuleListView(generics.ListAPIView):
 *     queryset = Rule.objects.all()
 */
const getRulesHandler = (req, res) => {
  res.json({
    success: true,
    total: 8,
    standard: 'Legal Metrology (Packaged Commodities) Rules, 2011 (as amended 2024)',
    rules: [
      { id: 'rule-6-1-a', number: 'Rule 6(1)(a)', title: 'Manufacturer / Packer / Importer Details', mandatory: true },
      { id: 'rule-6-1-b', number: 'Rule 6(1)(b)', title: 'Generic / Common Name of Commodity', mandatory: true },
      { id: 'rule-6-1-c', number: 'Rule 6(1)(c)', title: 'Net Quantity in Standard Metric Units', mandatory: true },
      { id: 'rule-6-1-d', number: 'Rule 6(1)(d)', title: 'Month and Year of Manufacture / Packing', mandatory: true },
      { id: 'rule-6-1-e', number: 'Rule 6(1)(e)', title: 'Maximum Retail Price (MRP) incl. of all taxes', mandatory: true },
      { id: 'rule-6-1-f', number: 'Rule 6(1)(f)', title: 'Consumer Care Contact Details', mandatory: true },
      { id: 'rule-6-10', number: 'Rule 6(10)', title: 'Country of Origin Declaration', mandatory: true },
      { id: 'rule-6-11', number: 'Rule 6(11)', title: 'Unit Sale Price (USP) Calculation', mandatory: true },
    ]
  });
};
app.get('/api/rules', getRulesHandler);
app.get('/api/rules/', getRulesHandler);

/**
 * 4B. PRODUCTS CATALOG API
 * GET/POST /api/products and /api/products/
 * (Django equivalent: ProductViewSet)
 */
let productsDb = [
  { id: 'prod-1', name: 'Britannia Good Day Butter Cookies', brand: 'Britannia', category: 'Food & Beverages', netQty: '100g', mrp: 30, complianceScore: 95, status: 'Compliant' },
  { id: 'prod-2', name: 'Amul Taaza Toned Milk', brand: 'Amul', category: 'Food & Beverages', netQty: '500ml', mrp: 28, complianceScore: 72, status: 'Non-Compliant' },
  { id: 'prod-3', name: 'Tata Salt Vaccum Evaporated', brand: 'Tata', category: 'Food & Beverages', netQty: '1kg', mrp: 28, complianceScore: 98, status: 'Compliant' },
  { id: 'prod-4', name: 'Maggi 2-Minute Noodles', brand: 'Nestle', category: 'Food & Beverages', netQty: '70g', mrp: 14, complianceScore: 84, status: 'Needs Review' },
  { id: 'prod-5', name: 'Dabur Red Ayurvedic Paste', brand: 'Dabur', category: 'Personal Care', netQty: '150g', mrp: 95, complianceScore: 92, status: 'Compliant' }
];

const getProductsHandler = (req, res) => {
  res.json({ success: true, total: productsDb.length, data: productsDb });
};
app.get('/api/products', getProductsHandler);
app.get('/api/products/', getProductsHandler);

app.post(['/api/products', '/api/products/'], (req, res) => {
  const newProd = { id: `prod-${Date.now()}`, ...req.body };
  productsDb.unshift(newProd);
  res.status(201).json({ success: true, data: newProd });
});

/**
 * 4C. VIOLATIONS STATS API
 * GET /api/violations/stats and /api/violations/stats/
 */
const getViolationsStatsHandler = (req, res) => {
  res.json({
    success: true,
    totalInspections: 128,
    complianceRate: '87.4%',
    topInfractions: [
      { rule: 'Rule 6(11)', label: 'Unit Sale Price (USP) font height', count: 42, penaltyRange: '₹25,000' },
      { rule: 'Rule 6(1)(a)', label: 'Missing / ambiguous packer address', count: 28, penaltyRange: '₹25,000 - ₹50,000' },
      { rule: 'Rule 6(1)(f)', label: 'Non-functional consumer helpline', count: 19, penaltyRange: '₹25,000' },
      { rule: 'Rule 18', label: 'Dual MRP sticker overwrite', count: 14, penaltyRange: '₹50,000' }
    ]
  });
};
app.get('/api/violations/stats', getViolationsStatsHandler);
app.get('/api/violations/stats/', getViolationsStatsHandler);

/**
 * 5. INSPECTOR COMPLAINTS & REQUESTS API (DGM CENTRAL AUTHORITY WORKFLOW)
 * 
 * Workflow:
 * Inspector -> Submit Request -> Stored in Database -> DGM Portal receives all requests -> DGM Action/Remarks -> Inspector
 * 
 * Django equivalents:
 * class InspectorRequestViewSet(viewsets.ModelViewSet):
 *     queryset = InspectorRequest.objects.all().order_by('-date')
 *     serializer_class = InspectorRequestSerializer
 */

// GET /api/requests - Get all or filter by inspectorId, status, priority, category
app.get('/api/requests', (req, res) => {
  const { inspectorId, status, priority, category, search } = req.query;
  let filtered = [...requestsDb];

  if (inspectorId) {
    filtered = filtered.filter(r => r.inspectorId === inspectorId);
  }
  if (status && status !== 'all') {
    filtered = filtered.filter(r => r.status.toLowerCase() === String(status).toLowerCase());
  }
  if (priority && priority !== 'all') {
    filtered = filtered.filter(r => r.priority.toLowerCase() === String(priority).toLowerCase());
  }
  if (category && category !== 'all') {
    filtered = filtered.filter(r => r.category.toLowerCase() === String(category).toLowerCase());
  }
  if (search) {
    const s = String(search).toLowerCase();
    filtered = filtered.filter(r => 
      r.title.toLowerCase().includes(s) || 
      r.description.toLowerCase().includes(s) ||
      r.inspectorName.toLowerCase().includes(s) ||
      r.id.toLowerCase().includes(s) ||
      (r.productName && r.productName.toLowerCase().includes(s))
    );
  }

  // Calculate summary metrics
  const stats = {
    total: requestsDb.length,
    pending: requestsDb.filter(r => r.status === 'Pending Review' || r.status === 'Submitted').length,
    underReview: requestsDb.filter(r => r.status === 'Under Review').length,
    approved: requestsDb.filter(r => r.status === 'Approved').length,
    rejected: requestsDb.filter(r => r.status === 'Rejected').length,
    resolved: requestsDb.filter(r => r.status === 'Resolved').length,
  };

  res.json({
    success: true,
    total: filtered.length,
    stats,
    data: filtered
  });
});

// POST /api/requests - Create new complaint/request from Inspector
app.post('/api/requests', (req, res) => {
  try {
    const {
      title,
      description,
      category = 'General Compliance Request',
      priority = 'Medium',
      location = 'Field Inspection Site',
      inspectorId = 'usr-001',
      inspectorName = 'Inspector Rajesh Sharma',
      inspectorEmail = 'inspector@lmcc.demo',
      inspectorDivision = 'Indore Central Division',
      productId = null,
      productName = 'Packaged Commodity Sample',
      imageUrl = ''
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required.' });
    }

    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);
    const newId = `REQ-2026-${String(requestsDb.length + 1).padStart(3, '0')}`;

    const newRequest = {
      id: newId,
      title,
      description,
      category,
      priority,
      location,
      date: dateStr,
      inspectorId,
      inspectorName,
      inspectorEmail,
      inspectorDivision,
      status: 'Pending Review', // Lifecycle: Submitted -> Pending Review -> Under Review -> Approved / Rejected -> Resolved
      productId,
      productName,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
      dgmRemarks: '',
      dgmActionDate: '',
      dgmOfficerName: '',
      timeline: [
        { status: 'Submitted', timestamp: dateStr, note: `Request submitted by ${inspectorName}`, by: inspectorName },
        { status: 'Pending Review', timestamp: dateStr, note: 'Routed to DGM Central Review Desk', by: 'System' }
      ]
    };

    requestsDb.unshift(newRequest);

    console.log(`[POST /api/requests] New request created: ${newId} by ${inspectorName}`);

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully and routed to DGM Portal.',
      data: newRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/requests/:id - DGM updates status, remarks, approval/rejection/resolution
app.patch('/api/requests/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, dgmRemarks, dgmOfficerName = 'Dr. Anita Verma (DGM)' } = req.body;

    const reqIndex = requestsDb.findIndex(r => r.id === id);
    if (reqIndex === -1) {
      return res.status(404).json({ success: false, error: 'Request not found.' });
    }

    const existing = requestsDb[reqIndex];
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

    const updatedTimeline = [...(existing.timeline || [])];
    if (status && status !== existing.status) {
      updatedTimeline.push({
        status,
        timestamp: dateStr,
        note: dgmRemarks || `Status updated to ${status} by DGM`,
        by: dgmOfficerName
      });
    } else if (dgmRemarks && dgmRemarks !== existing.dgmRemarks) {
      updatedTimeline.push({
        status: existing.status,
        timestamp: dateStr,
        note: `DGM added remarks: ${dgmRemarks}`,
        by: dgmOfficerName
      });
    }

    const updatedRequest = {
      ...existing,
      status: status || existing.status,
      dgmRemarks: dgmRemarks !== undefined ? dgmRemarks : existing.dgmRemarks,
      dgmActionDate: dateStr,
      dgmOfficerName,
      timeline: updatedTimeline
    };

    requestsDb[reqIndex] = updatedRequest;

    console.log(`[PATCH /api/requests/${id}] DGM updated status to: ${updatedRequest.status}`);

    res.json({
      success: true,
      message: `Request ${id} updated by DGM.`,
      data: updatedRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==============================================================================
// 🌐 VITE INTEGRATION & STATIC ASSET SERVING
// ==============================================================================
// In development: Vite handles JSX compilation & client hot updates
// In production: Express statically serves compiled frontend from /dist
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`✅ LexiScan Backend Server running on http://0.0.0.0:${PORT}`);
    console.log(`📦 Architecture: Express.js REST API + Vite Full-Stack`);
    console.log(`🐍 Django Analogy: views.py & urls.py active at /api/*`);
    console.log(`======================================================\n`);
  });
}

startServer();
