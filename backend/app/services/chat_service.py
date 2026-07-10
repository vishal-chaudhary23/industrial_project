# from langchain.chains import create_retrieval_chain
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain_classic.chains import create_retrieval_chain
# from langchain_classic.chains.combine_documents import (
#     create_stuff_documents_chain,
# )
from langchain_core.prompts import ChatPromptTemplate
import os

from app.retrieval.retriever import retriever
from app.services.llm import llm

from app.graph.graph_context import build_graph_context
from app.graph.entity_extractor import extract_entities

# keywoard matching method
# from app.prompts.prompts import (
#     general_prompt,
#     maintenance_prompt,
#     compliance_prompt,
#     lessons_prompt
# )

# router method
from app.agents.router import route_query




def ask_question(query: str):

    # 1. Vector retrieval
    docs = retriever.invoke(query)

    vector_context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    # 2. Extract entities from query
    extracted = extract_entities(query)

    graph_context = ""

    # 3. Retrieve graph information
    for entity in extracted["entities"]:

        graph_context += build_graph_context(
            entity["name"]
        )

        graph_context += "\n"

   
    # print("\n===== GRAPH CONTEXT =====")
    # print(graph_context)
    # print("=========================\n")


    agents = route_query(query)
    if not agents:
        agents = ["GENERAL"]
    print(agents)

    instructions = []

    if "MAINTENANCE" in agents:

        instructions.append("""
        MAINTENANCE ANALYSIS

        1. Historical Failures
        2. Potential Risks
        3. Recommended Inspections
        4. Preventive Maintenance Actions
        5. Relevant Standards
        6. Priority Level (Low/Medium/High)
        7. Immediate Actions

        Return actionable recommendations.

        """)

    if "LESSONS_LEARNED" in agents:

        instructions.append("""
        LESSONS LEARNED:
                            
        1. Identify recurring failures.
        2. Identify patterns and root causes.
        3. Extract lessons learned.
        4. Predict future risks.
        5. Recommend preventive actions.
        6. Highlight any relevant standards.
                            
        Focus on preventing recurrence.

        """)

    if "COMPLIANCE" in agents:

        instructions.append("""
        COMPLIANCE ANALYSIS:
        1. Applicable Standards and Regulations.
        2. Compliance Evidence Available.
        3. Supporting Documents and Records.
        4. Missing Compliance Evidence.
        5. Potential Compliance Gaps.
        6. Audit Readiness Status.
        7. Recommended Compliance Actions.

        
        Use Graph Context relationships such as:
        COMPLIES_WITH
        REFERENCES
        MENTIONED_IN

        If evidence is unavailable,
        explicitly state:
        "No evidence found in the provided context."
        """)

    if "RCA" in agents:

        instructions.append("""
        ROOT CAUSE ANALYSIS:
                            
        1. Identify the failure event.
        2. Determine the most likely root cause.
        3. List supporting evidence.
        4. Identify contributing factors.
        5. Recommend corrective actions.
        6. Recommend preventive actions.
        7. Severity Assessment
        
        Focus on why the failure occurred.
        """)
    if "GENERAL" in agents:

        instructions.append("""
        - Use provided information only.
        - Do not invent facts.
        - Include all relevant graph relationships.
        - Mention source documents when available.
        - Combine Vector Context and Graph Context whenever possible.
        """)
    if "RISK_ASSESSMENT" in agents:

        instructions.append("""
        RISK ASSESSMENT:

        1. Identify operational risks.
        2. Predict potential future failures.
        3. Assess reliability concerns.
        4. Estimate potential impact.
        5. Recommend mitigation actions.
        6. Highlight high-risk components.
        """)

    if "EQUIPMENT_360" in agents:

        instructions.append("""
        1. Equipment Overview
        2. Applicable Standards
        3. Historical Failures
        4. Related Equipment
        5. Associated Documents
        6. Operational Risks
        7. Maintenance Recommendations
        """)

    selected_prompt = ChatPromptTemplate.from_template("""
You are an Industrial Intelligence Assistant for manufacturing, maintenance, quality, and compliance operations.

Use the provided information to answer the user's question.

Information Sources:

1. Vector Context
- Contains relevant document excerpts retrieved from industrial documents.
- Use it for detailed facts, procedures, measurements, incidents, reports, and document content.

2. Graph Context
- Contains entity relationships extracted from the knowledge graph.
- Use it to understand connections between equipment, people, standards, documents, incidents, and locations.
                                          
If Graph Context contains relevant information, prioritize it.

Vector Context:
{context}

Graph Context:
{graph_context}

Question:
{input}

Required Analysis/ Tasks to Perform:
{instructions}

- Use only information found in the provided contexts/ evidance.
- Do NOT invent information.
- If the answer cannot be determined from the provided contexts, say so.

- Return a structured report with clear section headings.
- For risk assessments, explain why each risk exists using evidence from the provided contexts.

Return a structured report in Markdown.

                             
Output Format Requirements

- Use exactly ONE H1 (#) for the report title.
- Use H2 (##) for every major section.
- Do NOT use H3 unless absolutely necessary.
- Use bullet points (-) for lists.
- Bold (**) only important entities such as:
  - Equipment IDs
  - Standards
  - Incident IDs
  - Risk Level
  - Dates
- Leave one blank line between sections.
- Never use markdown tables.
- Never expose graph relationships like FAILED_DUE_TO or COMPLIES_WITH.
- Convert graph relationships into natural language.                                    
                                                       
Present structured information as bullet lists.
                                                       
You MUST answer only using the retrieved context.

If the requested equipment, standard, document, or incident is not present in the retrieved context, reply exactly:

"No information was found for this query in the uploaded documents."

Never infer or substitute a similar equipment.
Never answer using another pump.
Never guess.
                                                       
Answer:
""")


    # # 5. Ask LLM
    messages = selected_prompt.format_messages(
                    context=vector_context,
                    graph_context=graph_context,
                    input=query,
                    instructions="\n".join(instructions)
                )

    response = llm.invoke(messages)

    sources = []

    seen = set()

    for doc in docs:

        source = doc.metadata.get("source")

        if source and source not in seen:

            seen.add(source)

            sources.append({
                "document": source
            })

    scores = [
        doc.metadata.get("score", 0)
        for doc in docs
    ]

    vector_score = max(scores) if scores else 0

    graph_relations = len(graph_context.split("\n"))

    graph_bonus = min(
        graph_relations * 0.1,
        0.4
    )

    confidence = round(
        min(vector_score + graph_bonus, 1.0) * 100,
        1
    )
    graph_relations = len(graph_context.split("\n"))
    
    failure_count = graph_context.count("FAILED_DUE_TO")

    risk_score = failure_count * 20

    vector_text = vector_context.lower()

    high_keywords = [
        "critical",
        "catastrophic",
        "shutdown",
        "major failure",
        "severe",
    ]

    medium_keywords = [
        "warning",
        "abnormal",
        "vibration",
        "overheating",
        "leak",
    ]

    for word in high_keywords:
        if word in vector_text:
            risk_score += 15

    for word in medium_keywords:
        if word in vector_text:
            risk_score += 5

    risk_score = min(risk_score, 100)

    if risk_score >= 80:
        risk_level = "HIGH"

    elif risk_score >= 50:
        risk_level = "MEDIUM"

    else:
        risk_level = "LOW"

    response_data = {
        "answer": response.content,
        "retrieval_confidence": confidence,
        "sources": sources,
        "agents_used": agents
    }

    if (
        "RISK_ASSESSMENT" in agents
        or "EQUIPMENT_360" in agents
        or "LESSONS_LEARNED" in agents
    ):
        response_data["risk_score"] = risk_score
        response_data["risk_level"] = risk_level
        

    return response_data

    # return {
    # "answer": response.content,
    # "retrieval_confidence": confidence,
    # "sources": sources,
    # "agents_used": agents,
    # "risk_score": risk_score,
    # "risk_level": risk_level
    # }


