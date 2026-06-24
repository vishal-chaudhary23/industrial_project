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




# prompt = ChatPromptTemplate.from_template("""
# You are an Industrial Intelligence Assistant for manufacturing, maintenance, quality, and compliance operations.

# Use the provided information to answer the user's question.

# Information Sources:

# 1. Vector Context
# - Contains relevant document excerpts retrieved from industrial documents.
# - Use it for detailed facts, procedures, measurements, incidents, reports, and document content.

# 2. Graph Context
# - Contains entity relationships extracted from the knowledge graph.
# - Use it to understand connections between equipment, people, standards, documents, incidents, and locations.
                                          
# If Graph Context contains relevant information, prioritize it.

# Instructions:
# - Combine information from BOTH contexts whenever possible.
# - Prefer facts found in the provided contexts.
# - Do NOT invent information.
# - If the answer cannot be determined from the provided contexts, say so.
# - Explain relationships when they are relevant.
# - Mention equipment IDs, document IDs, standards, and incident names exactly as provided.
# - Keep answers concise but informative.
# - When listing standards, incidents, related equipment, or relationships, include ALL relevant items found in Graph Context.
# - Do not omit entities unless explicitly asked to summarize.
# - For incident-related questions, explain cause, affected equipment, and associated documents if available.

# Vector Context:
# {context}

# Graph Context:
# {graph_context}

# Question:
# {input}

# Answer:
# """)




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

    # query_lower = query.lower()

    # if any(word in query_lower for word in [
    #     "lesson",
    #     "learned",
    #     "recurring",
    #     "future risk",
    #     "historical failure"
    # ]):
    #     selected_prompt = lessons_prompt

    # elif any(word in query_lower for word in [
    #     "maintenance",
    #     "repair",
    #     "service",
    #     "inspection",
    #     "failure"
    # ]):
    #     selected_prompt = maintenance_prompt

    # elif any(word in query_lower for word in [
    #     "compliance",
    #     "audit",
    #     "regulation",
    #     "standard"
    # ]):
    #     selected_prompt = compliance_prompt

    # else:
    #     selected_prompt = general_prompt

    agents = route_query(query)
    if not agents:
        agents = ["GENERAL"]
    print(agents)

    instructions = []

    if "MAINTENANCE" in agents:

        instructions.append("""
        MAINTENANCE:
                            
        1. Historical Failures
        2. Potential Risks
        3. Recommended Inspections
        4. Preventive Maintenance Actions
        5. Relevant Standards
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
        """)

    if "COMPLIANCE" in agents:

        instructions.append("""
        COMPLIANCE:
        1. Applicable Standards
        2. Compliance Evidence
        3. Missing Evidence
        4. Potential Compliance Gaps
        5. Relevant Documents
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

    return {
    "answer": response.content,
    "retrieval_confidence": confidence,
    "sources": sources
    }


