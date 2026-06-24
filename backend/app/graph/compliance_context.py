from app.graph.neo4j_store import graph


def get_compliance_context(entity_name):

    query = """
    MATCH (e)-[r]->(n)
    WHERE toLower(e.name) CONTAINS toLower($name)

    RETURN
        type(r) AS relation,
        n.name AS target
    """

    results = graph.query(
        query,
        {"name": entity_name}
    )

    context = ""

    for row in results:

        if row["relation"] == "COMPLIES_WITH":

            context += (
                f"Standard: {row['target']}\n"
            )

        elif row["relation"] == "MENTIONED_IN":

            context += (
                f"Evidence Document: {row['target']}\n"
            )

    return context