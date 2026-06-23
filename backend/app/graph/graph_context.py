from app.graph.graph_retriever import get_entity_relations


def build_graph_context(entity_name):

    results = get_entity_relations(entity_name)

    context = []

    for row in results:

        context.append(
            f"{entity_name} {row['relation']} {row['target']}"
        )

    return "\n".join(context)