from app.graph.neo4j_store import graph

def get_entity_relations(equipment_name):

    query = """
    MATCH (e {name:$name})-[r]->(n)
    RETURN type(r) as relation,
           n.name as target
    """

    return graph.query(
        query,
        {"name": equipment_name}
    )

# print(
#     get_equipment_relations(
#         "Pump P-101"
#     )
# )