import json
from app.services.llm import llm


def route_query(query):

    prompt = f"""
Classify the user's query into one or more categories.

Categories:
GENERAL
- General information lookup.
- Standards, equipment details, documents, relationships.
- Questions that primarily require retrieving facts.

MAINTENANCE
- Maintenance planning.
- Inspection recommendations.
- Service procedures.
- Preventive maintenance actions.
- Equipment health monitoring.

COMPLIANCE
- Regulatory requirements.
- ISO, OSHA, API, ASME compliance.
- Audit preparation.
- Compliance evidence and gaps.

LESSONS_LEARNED
- Historical incidents.
- Recurring failures.
- Failure patterns.
- Lessons learned from past events.
- Future risk identification.

RCA
- Root Cause Analysis.
- Determining why a failure occurred.
- Identifying contributing factors.
- Corrective and preventive actions.

RISK_ASSESSMENT
- Predict future failures.
- Assess operational risks.
- Evaluate equipment reliability concerns.
- Identify high-risk failure patterns.
- Recommend mitigation strategies.


Return ONLY a JSON array.

Examples:

Question:
"What standards apply to P-101?"

Answer:
["GENERAL","COMPLIANCE"]


Question:
"What should I inspect before servicing P-101?"

Answer:
["MAINTENANCE"]


Question:
"What lessons can we learn from P-101 failures?"

Answer:
["LESSONS_LEARNED"]


Question:
"Why did P-101 fail?"

Answer:
["RCA"]


Question:
"What should I know before servicing P-101 based on historical failures?"
Answer:
["MAINTENANCE","LESSONS_LEARNED"]

Question:
"What risks are associated with Pump P-101?"

Answer:
["RISK_ASSESSMENT"]

Question:
"What failures are likely to occur again?"

Answer:
["RISK_ASSESSMENT","LESSONS_LEARNED"]


Question:
{query}
"""

    response = llm.invoke(prompt)

    return json.loads(response.content)


print(
    route_query(
        "What should I know before servicing Pump P-101 based on historical failures and Why did P-101 fail?"
        # "Why did P-101 fail?"
    )
)