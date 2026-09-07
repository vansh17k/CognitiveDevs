/**
 * ============================================================================
 * DECLARATION TABLE COMPONENT - RULE 6 CHECKLIST
 * ============================================================================
 * 
 * Verifies the 8 mandatory declarations prescribed by Rule 6 of PCR 2011:
 * 1. Name & Address of Manufacturer / Packer
 * 2. Generic Name of Commodity
 * 3. Net Quantity in Standard SI Units
 * 4. Month & Year of Mfg / Packing
 * 5. Maximum Retail Price (MRP)
 * 6. Consumer Care Contact Details
 * 7. Country of Origin
 * 8. Unit Sale Price (USP)
 */

import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { formatINR } from '../utils/helpers.js';

export const DeclarationTable = ({ product }) => {
  if (!product) return null;

  const declarations = [
    {
      sr: 1,
      rule: 'Rule 6(1)(a)',
      title: 'Manufacturer / Packer Name & Address',
      declared: Boolean(product.manufacturerDeclared && product.manufacturerName),
      value: product.manufacturerName ? `${product.manufacturerName}, ${product.manufacturerAddress || ''}` : 'Not detected on package',
      requirement: 'Full postal address with pincode'
    },
    {
      sr: 2,
      rule: 'Rule 6(1)(b)',
      title: 'Generic / Common Name of Commodity',
      declared: Boolean(product.genericNameDeclared && product.genericName),
      value: product.genericName || 'Not detected on package',
      requirement: 'Prominently displayed on PDP'
    },
    {
      sr: 3,
      rule: 'Rule 6(1)(c)',
      title: 'Net Quantity in Standard SI Units',
      declared: Boolean(product.netQuantityDeclared && product.netQuantityValue),
      value: product.netQuantityValue || 'Missing declaration',
      requirement: 'Standard SI metric units (g, kg, ml, l)'
    },
    {
      sr: 4,
      rule: 'Rule 6(1)(d)',
      title: 'Month & Year of Manufacture / Packing',
      declared: Boolean(product.mfgDate && product.mfgDate.trim().length >= 4),
      value: product.mfgDate || 'Missing MM/YYYY date stamp',
      requirement: 'Unambiguous MM/YYYY or Month YYYY'
    },
    {
      sr: 5,
      rule: 'Rule 6(1)(e)',
      title: 'Maximum Retail Price (MRP)',
      declared: Boolean(product.mrpDeclared && product.mrpValue),
      value: product.mrpValue ? `${formatINR(product.mrpValue)} (Incl. of all taxes)` : 'Missing retail price',
      requirement: 'Mandatory "Inclusive of all taxes"'
    },
    {
      sr: 6,
      rule: 'Rule 6(1)(n)',
      title: 'Consumer Care & Grievance Contact',
      declared: Boolean(product.consumerCareDetails && product.consumerCareContact),
      value: product.consumerCareContact || 'Missing phone/email support',
      requirement: 'Officer designation, phone, email'
    },
    {
      sr: 7,
      rule: 'Rule 6(1)(m)',
      title: 'Country of Origin',
      declared: Boolean(product.countryOfOriginDeclared && product.countryOfOrigin),
      value: product.countryOfOrigin || 'India (Domestic)',
      requirement: 'Mandatory declaration for all commodities'
    },
    {
      sr: 8,
      rule: 'Rule 6(1)(j)',
      title: 'Unit Sale Price (USP)',
      declared: Boolean(product.uspDeclared && product.uspValue),
      value: product.uspValue || 'Missing unit sale price',
      requirement: 'Price per standard g/kg/ml'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Rule 6 Statutory Declarations Verification Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated verification under Legal Metrology (Packaged Commodities) Rules, 2011
          </p>
        </div>
        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#0d4734] text-white">
          PCR-2011
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/70 text-slate-600 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 w-12">#</th>
              <th className="py-3 px-3">Rule Reference</th>
              <th className="py-3 px-3">Mandatory Declaration</th>
              <th className="py-3 px-3">Detected OCR Value</th>
              <th className="py-3 px-4 text-center w-28">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {declarations.map((item) => (
              <tr key={item.sr} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 font-mono text-slate-400 font-semibold">{item.sr}</td>
                <td className="py-3.5 px-3 font-mono font-bold text-[#0d4734]">{item.rule}</td>
                <td className="py-3.5 px-3">
                  <div className="font-bold text-slate-900">{item.title}</div>
                  <div className="text-[11px] text-slate-500">{item.requirement}</div>
                </td>
                <td className="py-3.5 px-3 font-mono text-slate-800 max-w-xs truncate">
                  {item.value}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {item.declared ? (
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASS</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>FAIL</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
