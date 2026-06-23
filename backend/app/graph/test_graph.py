from app.graph.entity_extractor import extract_entities
from app.graph.neo4j_store import save_graph

text = """
Pump P-101 was inspected by John Smith.
Pump P-101 complies with ISO 9001.
"""

data = extract_entities(text)

print(data)

save_graph(data)

print("Graph Saved Successfully")