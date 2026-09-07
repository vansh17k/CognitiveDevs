"""
Statutory Legal Metrology (Packaged Commodities) Rules, 2011 Verification Engine
"""
import re

MANDATORY_DECLARATIONS = [
    {"key": "product_name", "label": "Name and Description of Commodity", "rule": "Rule 6(1)(a)"},
    {"key": "net_quantity", "label": "Net Quantity (Standard Metric Unit)", "rule": "Rule 6(1)(b) & Rule 12"},
    {"key": "mrp", "label": "Maximum Retail Price (incl. of all taxes) & USP", "rule": "Rule 6(1)(e) & Rule 6(1)(h)"},
    {"key": "mfg_date", "label": "Month & Year of Manufacture/Pre-packing", "rule": "Rule 6(1)(d)"},
    {"key": "manufacturer", "label": "Name & Address of Manufacturer/Packer/Importer", "rule": "Rule 6(1)(a)"},
    {"key": "country_of_origin", "label": "Country of Origin / Assembly (Rule 6(1)(n))", "rule": "Rule 6(1)(n)"},
    {"key": "consumer_care", "label": "Consumer Care Name, Address, Tel, & Email", "rule": "Rule 6(1)(e)"},
    {"key": "best_before", "label": "Best Before / Expiry Date (Perishable Goods)", "rule": "Rule 6(1)(g)"},
]

def verify_label_declarations(extracted_text, metadata=None):
    """
    Evaluates extracted packaging text against the statutory Rule 6 PCR-2011 checklist.
    """
    text_lower = extracted_text.lower() if extracted_text else ""
    declarations_result = []
    violations_result = []

    # 1. Product Name
    has_name = bool(re.search(r'(name|commodity|item|milk|biscuit|oil|flour|soap|shampoo|noodle)', text_lower))
    declarations_result.append({
        "id": "decl-1",
        "name": "Generic Name of Commodity",
        "status": "Compliant" if has_name else "Non-Compliant",
        "value": "Detected on Primary Display Panel" if has_name else "Missing",
        "ruleReference": "Rule 6(1)(a) PCR-2011"
    })

    # 2. Net Quantity
    qty_match = re.search(r'(\d+(\.\d+)?\s*(g|kg|ml|l|ltr|gm|piece|units|count))', text_lower)
    if qty_match:
        declarations_result.append({
            "id": "decl-2",
            "name": "Net Quantity Declaration",
            "status": "Compliant",
            "value": qty_match.group(0),
            "ruleReference": "Rule 6(1)(b) & Rule 12"
        })
    else:
        declarations_result.append({
            "id": "decl-2",
            "name": "Net Quantity Declaration",
            "status": "Non-Compliant",
            "value": "Missing / Non-standard metric units",
            "ruleReference": "Rule 6(1)(b) & Rule 12"
        })
        violations_result.append({
            "id": "v-net-qty",
            "title": "Net Quantity Not Declared in Metric Units",
            "severity": "High",
            "ruleReference": "Rule 6(1)(b) & Rule 12 — Statutory Declaration of Net Quantity",
            "penalty": "Section 36(1) Fine up to ₹25,000"
        })

    # 3. Maximum Retail Price (MRP)
    mrp_match = re.search(r'(mrp|rs\.?|inr|₹)\s*(\d+(\.\d+)?)', text_lower)
    has_all_taxes = 'incl' in text_lower or 'tax' in text_lower
    if mrp_match:
        declarations_result.append({
            "id": "decl-3",
            "name": "Maximum Retail Price (MRP)",
            "status": "Compliant" if has_all_taxes else "Needs Review",
            "value": f"₹{mrp_match.group(2)} ({'Incl. of all taxes' if has_all_taxes else 'Taxes unstated'})",
            "ruleReference": "Rule 6(1)(e) & Rule 6(1)(h)"
        })
        if not has_all_taxes:
            violations_result.append({
                "id": "v-mrp-tax",
                "title": "MRP Missing 'Inclusive of All Taxes' Mandatory Suffix",
                "severity": "Medium",
                "ruleReference": "Rule 6(1)(e) — Price Indication Format",
                "penalty": "Compounding Fee ₹10,000 under Section 48"
            })
    else:
        declarations_result.append({
            "id": "decl-3",
            "name": "Maximum Retail Price (MRP)",
            "status": "Non-Compliant",
            "value": "Missing Price Declaration",
            "ruleReference": "Rule 6(1)(e) & Rule 6(1)(h)"
        })
        violations_result.append({
            "id": "v-mrp-missing",
            "title": "Missing Statutory MRP Declaration",
            "severity": "High",
            "ruleReference": "Rule 6(1)(e) — Mandatory MRP Disclosure",
            "penalty": "Section 36(1) Fine up to ₹25,000"
        })

    # 4. Country of Origin (Rule 6(1)(n))
    origin_match = re.search(r'(country of origin|made in|product of|origin:)\s*([a-zA-Z]+)', text_lower)
    if origin_match or 'india' in text_lower:
        declarations_result.append({
            "id": "decl-4",
            "name": "Country of Origin",
            "status": "Compliant",
            "value": origin_match.group(2).capitalize() if origin_match else "India",
            "ruleReference": "Rule 6(1)(n) PCR-2011"
        })
    else:
        declarations_result.append({
            "id": "decl-4",
            "name": "Country of Origin",
            "status": "Non-Compliant",
            "value": "Missing Country of Origin",
            "ruleReference": "Rule 6(1)(n) PCR-2011"
        })
        violations_result.append({
            "id": "v-origin-missing",
            "title": "Missing Country of Origin Declaration",
            "severity": "High",
            "ruleReference": "Rule 6(1)(n) — Mandatory Origin Disclosure for All Packaged Commodities",
            "penalty": "Seizure of goods and fine up to ₹25,000 under Section 36(1)"
        })

    # 5. Consumer Care Helpline
    has_care = bool(re.search(r'(consumer care|customer care|helpline|care@|toll free|feedback)', text_lower))
    declarations_result.append({
        "id": "decl-5",
        "name": "Consumer Care Redressal Details",
        "status": "Compliant" if has_care else "Non-Compliant",
        "value": "Available with contact channel" if has_care else "Missing Customer Care Details",
        "ruleReference": "Rule 6(1)(e)"
    })
    if not has_care:
        violations_result.append({
            "id": "v-care-missing",
            "title": "Missing Consumer Grievance Contact Channel",
            "severity": "Medium",
            "ruleReference": "Rule 6(1)(e) — Mandatory Consumer Redressal Details",
            "penalty": "Notice to manufacturer / ₹10,000 fine"
        })

    status = "Non-Compliant" if len(violations_result) > 0 else "Compliant"
    return {
        "status": status,
        "declarations": declarations_result,
        "violations": violations_result,
        "total_violations": len(violations_result)
    }
