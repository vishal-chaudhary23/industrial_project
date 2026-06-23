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



prompt = ChatPromptTemplate.from_template("""
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

Instructions:
- Combine information from BOTH contexts whenever possible.
- Prefer facts found in the provided contexts.
- Do NOT invent information.
- If the answer cannot be determined from the provided contexts, say so.
- Explain relationships when they are relevant.
- Mention equipment IDs, document IDs, standards, and incident names exactly as provided.
- Keep answers concise but informative.
- For incident-related questions, explain cause, affected equipment, and associated documents if available.

Vector Context:
{context}

Graph Context:
{graph_context}

Question:
{input}

Answer:
""")

# question_answer_chain = create_stuff_documents_chain(
#     llm,
#     prompt
# )

# rag_chain = create_retrieval_chain(
#     retriever,
#     question_answer_chain
# )


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

    # # 4. Combine contexts
    # context = f"""
    #         Vector Context:
    #         {vector_context}

    #         Graph Context:
    #         {graph_context}
    #         """
    # return response

    # print("\n===== GRAPH CONTEXT =====")
    # print(graph_context)
    # print("=========================\n")

    # # 5. Ask LLM
    # response = question_answer_chain.invoke({
    #     "input": query,
    #     "context": vector_context,
    #     "graph_context": graph_context
    # })
    messages = prompt.format_messages(
    context=vector_context,
    graph_context=graph_context,
    input=query
    )

    response = llm.invoke(messages)

    return response.content


