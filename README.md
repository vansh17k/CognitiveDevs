# LS: Suraksha1

AI-Powered Packaging Compliance Engine under the **Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011)** & Legal Metrology Act, 2009.

## 🏛️ System Overview

The LS (Suraksha1) automated enforcement platform assists field inspectors, manufacturers, and state enforcement directorates in verifying statutory declarations on pre-packaged commodities sold in India.

### 📋 Mandatory Rule 6 Declarations Checked
1. **Manufacturer / Packer / Importer Details** (Rule 6(1)(a) & 6(1)(ab))
2. **Generic / Common Name of Commodity** (Rule 6(1)(b))
3. **Net Quantity in Standard SI Units** (Rule 6(1)(c) & Rule 12)
4. **Month and Year of Manufacture / Packing** (Rule 6(1)(d))
5. **Maximum Retail Price (MRP) - Inclusive of all taxes** (Rule 6(1)(e))
6. **Consumer Care & Grievance Contact** (Rule 6(1)(n))
7. **Country of Origin for Imported Goods** (Rule 6(1)(m))
8. **Unit Sale Price (USP)** (Rule 6(1)(j))
9. **Font Size & Principal Display Panel (PDP)** (Rule 7, Table-1)

---

## 🗂️ Project Directory Structure

```text
lmcc-mvp/
│
├── package.json          # Node dependencies & scripts
├── next.config.js        # Next.js configuration
├── postcss.config.js     # PostCSS setup
├── tailwind.config.js    # Tailwind color & font theme
├── jsconfig.json         # Path alias & JS module resolution
│
├── public/               # Static images, product samples & logos
│   ├── images/
│   │   ├── logo.png
│   │   ├── products/     # Sample commodity package mockups
│   │   │   ├── amul.png
│   │   │   ├── parle-g.png
│   │   │   ├── lays.png
│   │   │   ├── maggi.png
│   │   │   └── coca-cola.png
│   │   └── icons/
│   └── sample-labels/    # High-resolution front & back label samples
│       ├── product-front.jpg
│       └── product-back.jpg
│
├── src/
│   ├── app/              # App Router Pages & Layout
│   │   ├── layout.jsx    # Root state, toast & dashboard layout wrapper
│   │   ├── page.jsx      # Portal home & statutory landing page
│   │   ├── login/        # Inspector / Administrator authentication
│   │   ├── dashboard/    # Compliance overview & metrics
│   │   ├── scan/         # Image upload & preset label selector
│   │   ├── analysis/     # AI OCR detection animation & token extraction
│   │   ├── result/       # 3-column bounding box verification
│   │   ├── report/       # Official Form-V Inspection Notice generator
│   │   ├── history/      # Archived audit inspection logs
│   │   ├── violations/   # Categorized non-compliance register
│   │   ├── analytics/    # Distribution charts & trends
│   │   ├── products/     # Verified commodities repository
│   │   ├── rules/        # PCR 2011 statutory clauses & penalties
│   │   ├── users/        # Authorized inspector user management
│   │   ├── settings/     # Officer profile & station configuration
│   │   └── help/         # SOP guide & inspector FAQs
│   │
│   ├── components/       # Modular UI Component Library
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── StatCard.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductTable.jsx
│   │   ├── ViolationCard.jsx
│   │   ├── ComplianceScore.jsx
│   │   ├── UploadBox.jsx
│   │   ├── ImagePreview.jsx
│   │   ├── DeclarationTable.jsx
│   │   ├── ReportPreview.jsx
│   │   ├── SearchBar.jsx
│   │   ├── FilterBar.jsx
│   │   ├── Chart.jsx
│   │   └── LoadingScanner.jsx
│   │
│   ├── data/             # Domain Datasets & Rules
│   │   ├── products.js   # Pre-configured test commodities
│   │   ├── rules.js      # Legal Metrology statutory rules & penal sections
│   │   ├── violations.js # Infraction categories & severity definitions
│   │   └── dashboard.js  # Analytics seed metrics
│   │
│   ├── utils/            # Calculation & Storage Utilities
│   │   ├── compliance.js # Legal scoring & Rule 6 validation logic
│   │   ├── storage.js    # LocalStorage persistence manager
│   │   └── helpers.js    # Formatting, OCR simulation, export helpers
│   │
│   └── styles/
│       └── globals.css   # Tailwind v4 directives & print styles
│
└── README.md
```

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
http://localhost:3000
```
