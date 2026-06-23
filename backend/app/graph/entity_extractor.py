import os
import json

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.services.llm import llm

load_dotenv()

prompt = ChatPromptTemplate.from_template("""
You are an Industrial Knowledge Graph Extraction System.

Extract entities and relationships from the industrial document text.

Rules:
- Return ONLY valid JSON.
- Do not add explanations or markdown.
- Do not invent information.
- Use exact names from the text whenever possible.
- If no entities or relationships exist, return empty arrays.

Entity Types:
- equipment: pumps, valves, motors, compressors, sensors, PLCs, pipelines, tanks, equipment tags (e.g., P-101, V-201)
- person: engineers, operators, inspectors, managers
- standard: ISO, OSHA, API, ASME, IEC, regulatory references
- document: SOPs, manuals, work orders, inspection reports, audit reports, permits
- incident: failures, leaks, shutdowns, overheating, accidents, faults
- parameter: pressure, temperature, flow rate, vibration, RPM, voltage, current
- location: plant areas, units, production lines, stations

Relationship Types:
- INSPECTED
- OPERATED
- REPORTED
- CAUSED
- FAILED_DUE_TO
- LOCATED_IN
- COMPLIES_WITH
- REFERENCES
- MAINTAINED_BY
- RELATED_TO

Text:
{text}

Output Schema:

{{
  "entities": [
    {{
      "name": "",
      "type": ""
    }}
  ],
  "relationships": [
    {{
      "source": "",
      "relation": "",
      "target": ""
    }}
  ]
}}
                                          
Relationship direction rules:

Person INSPECTED Equipment
Document REFERENCES Equipment
Equipment COMPLIES_WITH Standard
Equipment FAILED_DUE_TO Incident
Equipment LOCATED_IN Location
                                          
                                          
Expected output(Example) :
{{
  "entities": [
    {{
      "name": "Pump P-101",
      "type": "equipment"
    }},
    {{
      "name": "John Smith",
      "type": "person"
    }},
    {{
      "name": "bearing overheating",
      "type": "incident"
    }},
    {{
      "name": "WO-1234",
      "type": "document"
    }},
    {{
      "name": "ISO 9001",
      "type": "standard"
    }}
  ],
  "relationships": [
    {{
      "source": "Pump P-101",
      "relation": "FAILED_DUE_TO",
      "target": "bearing overheating"
    }},
    {{
      "source": "John Smith",
      "relation": "INSPECTED",
      "target": "Pump P-101"
    }},
    {{
      "source": "WO-1234",
      "relation": "REFERENCES",
      "target": "Pump P-101"
    }},
    {{
      "source": "Pump P-101",
      "relation": "COMPLIES_WITH",
      "target": "ISO 9001"
    }}
  ]
}}
""")

def extract_entities(text):

    messages = prompt.format_messages(text=text)

    response = llm.invoke(messages)

    content = response.content.strip()

    if content.startswith("```json"):
        content = content.replace("```json", "")
        content = content.replace("```", "").strip()

    try:
        return json.loads(content)

    except Exception as e:
        print(f"JSON Parse Error: {e}")
        print(content)

        return {
            "entities": [],
            "relationships": []
        }
    

if __name__ == "__main__":

    sample_text = """
    Pump P-101 was inspected by John Smith.
    Pump P-101 complies with ISO 9001.
    """

    result = extract_entities(sample_text)

    print(json.dumps(result, indent=2))