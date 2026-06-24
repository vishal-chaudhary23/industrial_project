from app.graph.graph_context import build_graph_context
from app.services.llm import llm


def generate_lessons(equipment_name):

    graph_context = build_graph_context(
        equipment_name
    )

    prompt = f"""
        You are a Senior Industrial Reliability Engineer.

        Equipment:
        {equipment_name}

        Historical Knowledge Graph Data:
        {graph_context}

        Generate:

        1. Historical Failures
        2. Potential Risks
        3. Recommended Inspections
        4. Preventive Maintenance Actions
        5. Relevant Standards

        Return concise bullet points.
        """

    response = llm.invoke(prompt)

    return response.content