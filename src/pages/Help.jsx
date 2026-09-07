import React, { useState } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  Camera, 
  Sparkles, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Search,
  X
} from 'lucide-react';

export const Help = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      q: 'What is the Legal Metrology (Packaged Commodities) Rules, 2011?',
      a: 'The Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011) are framed under the Legal Metrology Act, 2009. They mandate that all pre-packaged commodities sold in India carry clear, unambiguous statutory declarations to protect consumers against unfair trade practices and deceptive packaging.'
    },
    {
      q: 'What are the 8 mandatory declarations required under Rule 6?',
      a: 'Rule 6 mandates: (1) Name and address of manufacturer/packer/importer, (2) Common/generic name of the commodity, (3) Net quantity in standard SI units (g, kg, ml, l), (4) Month and year of manufacture or pre-packing, (5) Maximum Retail Price (MRP) inclusive of all taxes, (6) Consumer care contact details (phone, email, postal address), (7) Country of origin for imported goods, and (8) Unit Sale Price (USP) where applicable.'
    },
    {
      q: 'How does the "🔎 Explain This Violation" feature work?',
      a: 'When an officer clicks "Explain This Violation", the system uses a fine-tuned Gemini legal reasoning prompt to break down: (1) Why the package was flagged, (2) The exact clause in PCR-2011 that was violated, (3) The severity assessment, and (4) The exact corrective action required by the manufacturer to become compliant.'
    },
    {
      q: 'What are the prescribed font height requirements under Rule 7 Table-1?',
      a: 'For packages with net weight/volume up to 200g/200ml: minimum font height is 1.0mm (blown/embossed: 2.0mm). For packages between 200g-1kg / 200ml-1L: minimum font height is 2.0mm (blown: 4.0mm). For packages above 1kg/1L: minimum font height is 4.0mm (blown: 6.0mm).'
    },
    {
      q: 'Can LexiScan results be submitted directly as legal evidence in court?',
      a: 'LexiScan provides AI-assisted preliminary screening. While its report provides formatted timestamps, OCR token bounds, and rule references suitable for notice drafting, Section 18 of the Act requires the authorized inspector to verify the physical original sample packaging before formal compounding or prosecution under Section 36.'
    },
    {
      q: 'What is the mandatory format for declaring the Maximum Retail Price (MRP)?',
      a: 'Under Rule 6(1)(e), MRP must be printed as "Maximum Retail Price ₹xx.xx (inclusive of all taxes)" or "MRP Rs. xx.xx incl. of all taxes". Any alteration, smudging, or overwriting of the MRP label is strictly prohibited and constitutes a punishable violation under Section 36(1).'
    },
    {
      q: 'How should the Unit Sale Price (USP) be declared on packages?',
      a: 'Under Rule 6(1)(f), for packages containing more than 1kg or 1L, the USP must be declared per kg or per litre. For packages weighing less than 1kg/1L, it should be declared per gram or per millilitre. For commodities sold by count, it must be declared per piece/item.'
    },
    {
      q: 'What is the definition and area calculation of the Principal Display Panel (PDP)?',
      a: 'Under Rule 2(h) and Rule 7, PDP is the total surface area of the package that is displayed or visible to the consumer under normal retail display conditions. For rectangular packages, it is 40% of the total surface area; for cylindrical packages, it is 40% of the total height multiplied by the circumference.'
    },
    {
      q: 'What penalties are prescribed under Section 36 of the Legal Metrology Act, 2009?',
      a: 'Whoever manufactures, packs, imports, sells, or distributes any non-standard pre-packaged commodity is liable to a fine up to ₹25,000 for the first offense, up to ₹50,000 for the second offense, and up to ₹1,00,000 or imprisonment up to one year (or both) for subsequent offenses.'
    },
    {
      q: 'Are e-commerce platforms subject to the Packaged Commodities Rules?',
      a: 'Yes. Under Rule 6(10), all e-commerce entities displaying pre-packaged commodities for sale must display the mandatory declarations (manufacturer name, net quantity, MRP, country of origin, expiry/best before, and consumer care details) on the digital product listing page before the consumer places an order.'
    },
    {
      q: 'How does the AI OCR engine handle bilingual declarations (English and Hindi)?',
      a: 'The OCR pipeline uses multilingual vision recognition models to parse both Devanagari and Latin scripts simultaneously. Under Rule 9, declarations can be made in either Hindi in Devanagari script or English, or in both languages.'
    },
    {
      q: 'What are the rules regarding the declaration of "Best Before" or "Use By" dates?',
      a: 'Rule 6(1)(d) mandates that the month and year of manufacture/packaging must be clearly stated. For commodities that may perish or lose efficacy over time (such as food, cosmetics, or pharmaceuticals), the "Use By" date or "Best Before" duration from manufacture must also be clearly stated.'
    },
    {
      q: 'What constitutes deceptive or slack packaging under the Rules?',
      a: 'Under Rule 21, a package is considered deceptive if its exterior dimensions are disproportionately large relative to the volume or quantity of the enclosed commodity (excessive headspace or slack fill without technical packaging necessity), misleading consumers about the actual product quantity.'
    },
    {
      q: 'What are the permissible maximum error tolerances for net weight/volume?',
      a: 'The First Schedule of PCR 2011 outlines Maximum Permissible Errors (MPE) based on package quantity classes. For instance, for 50g-100g items, maximum allowable deficiency is 4.5g; for 1kg-10kg items, maximum allowable deficiency is 1.5% of net quantity.'
    },
    {
      q: 'How does an Inspector generate and dispatch a statutory Form-V Show Cause Notice?',
      a: 'Upon reviewing and validating non-compliant scan results in the Inspection Details panel, the officer can click "Generate Notice". The system auto-populates the violator address, identified infractions, statutory clauses, and notice deadlines into a standard Form-V PDF template ready for digital dispatch.'
    },
    {
      q: 'How are multi-piece and combo gift packs evaluated under Rule 24?',
      a: 'Rule 24 specifies that multi-piece packages containing multiple distinct commodities must declare the individual net quantity and count of each commodity, the total combined MRP, the manufacturing date of each item, and individual manufacturer details on the outer master package.'
    },
    {
      q: 'What are the guidelines for Country of Origin declarations on imported goods?',
      a: 'Under Rule 6(1)(a) & 6(1)(g), every imported commodity must state "Country of Origin: [Name of Country]" and the complete name and address of the registered Indian importer in clear, indelible print before customs clearance and domestic distribution.'
    },
    {
      q: 'What should an inspector do if a package has missing barcode/QR information?',
      a: 'While QR codes and barcodes assist traceability, statutory compliance requires all 8 mandatory declarations to be visibly printed in human-readable text on the packaging. Reliance solely on QR codes for mandatory declarations without physical text on the label is a statutory non-compliance.'
    },
    {
      q: 'How does the central DGM action queue process field inspector seizure requests?',
      a: 'Field inspectors submit seizure requests or compounding recommendations from the field. The Deputy Director/DGM reviews the high-resolution label scans, violation logs, and proposed compounding fines in the Central Queue to grant formal legal approval or order further investigation.'
    },
    {
      q: 'Can inspection reports and historical audit logs be exported for departmental audits?',
      a: 'Yes, the system allows authorized officers to filter and export complete audit trails, compounding notices, violation metrics, and inspection records in standard CSV, JSON, and PDF formats for state-level and national review meetings.'
    }
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Enforcement Guide & Help Center</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Standard operating procedures, legal guidelines, and OCR photo best practices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-[#0d4734] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            SOP Version 2.4
          </span>
        </div>
      </div>

      {/* SEARCH BAR ABOVE FREQUENTLY ASKED QUESTIONS */}
      <div className="w-full flex justify-center">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="group flex items-stretch w-[80%] rounded-full transition-all duration-300 hover:shadow-[0_0_22px_rgba(74,222,128,0.4)] focus-within:shadow-[0_0_24px_rgba(74,222,128,0.5)]"
        >
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search frequently asked questions, legal clauses, SOP..."
              className="w-full pl-5 pr-10 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-300 rounded-l-full rounded-r-none border-r-0 focus:outline-hidden focus:border-emerald-600 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-[#0d4734] hover:bg-[#093526] text-white text-xs sm:text-sm font-semibold rounded-r-full rounded-l-none border border-[#0d4734] transition-colors cursor-pointer shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-800">
            Frequently Asked Questions (FAQ)
          </h3>
          {searchQuery && (
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 space-y-2">
            <p>No questions found matching "{searchQuery}".</p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-[#0d4734] hover:underline cursor-pointer"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="py-2.5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left gap-3 text-xs font-medium text-slate-800 hover:text-[#0d4734] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5 shrink-0 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed pl-0.5">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

