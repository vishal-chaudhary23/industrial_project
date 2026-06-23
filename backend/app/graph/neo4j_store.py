import os
from dotenv import load_dotenv
from langchain_neo4j import Neo4jGraph
# from langchain_community.graphs import Neo4jGraph

load_dotenv()



graph = Neo4jGraph(
    url=os.getenv("NEO4J_URI"),
    username=os.getenv("NEO4J_USERNAME"),
    password=os.getenv("NEO4J_PASSWORD"),
    database=os.getenv("NEO4J_DATABASE")
)

# print(
#     graph.query(
#         "RETURN 'Connected' AS status"
#     )
# )

def create_entity(name, entity_type):
    query = f"""
    MERGE (n:{entity_type.capitalize()} {{
        name: $name
    }})
    """

    graph.query(
        query,
        {"name": name}
    )


def create_relationship(source, relation, target):
    query = f"""
    MATCH (a {{name: $source}})
    MATCH (b {{name: $target}})

    MERGE (a)-[:{relation}]->(b)
    """

    graph.query(
        query,
        {
            "source": source,
            "target": target
        }
    )


def save_graph(data):
    for entity in data["entities"]:

        create_entity(
            entity["name"],
            entity["type"]
        )

    for rel in data["relationships"]:

        create_relationship(
            rel["source"],
            rel["relation"],
            rel["target"]
        )