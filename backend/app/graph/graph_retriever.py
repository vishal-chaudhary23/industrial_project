from app.graph.neo4j_store import graph

def get_entity_relations(entity_name):

    query = """
    MATCH (e)-[r]->(n)
    WHERE toLower(e.name) CONTAINS toLower($name)
    RETURN
        type(r) AS relation,
        n.name AS target

    """

    return graph.query(
        query,
        {"name": entity_name}
    )

# print(
#     get_equipment_relations(
#         "Pump P-101"
#     )
# )