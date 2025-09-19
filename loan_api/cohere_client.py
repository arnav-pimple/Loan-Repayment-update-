import cohere
from config import COHERE_API_KEY

co = cohere.Client(COHERE_API_KEY)

def analyze_loan_with_cohere(loan_type, form_data, derived_ratios):
    prompt = build_prompt(loan_type, form_data, derived_ratios)
    response = co.chat(
        model="command-r",  # Use Cohere's chat endpoint and best model
        message=prompt,
        temperature=0.3,
        max_tokens=250
    )
    # Assuming the Cohere response contains JSON-like text
    return parse_cohere_response(response.text)

def build_prompt(loan_type, data, ratios):
    txt = f"""A candidate applied for a {loan_type} with the following details:\n"""
    for k, v in data.items():
        txt += f"- {k.replace('_', ' ').title()}: {v}\n"
    for k, v in ratios.items():
        txt += f"- {k.replace('_', ' ').title()} (calculated): {v}\n"
    txt += """\nEvaluate eligibility and reply STRICTLY in JSON format:
{{
  "decision": "Approved or Risk",
  "risk_score": [0-100],
  "reasons": ["..."],
  "improvement_tips": ["..."],
  "comparison_insights": ["..."]
}}
If rejected, give alternative loan suggestions."""
    return txt

def parse_cohere_response(text):
    import json, re
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except:
            pass
    # Fallback, manual parse if necessary
    return {"decision": "Risk", "risk_score": 50, "reasons": ["Unable to parse Cohere response"], "improvement_tips": [], "comparison_insights": []}
