from app.ingestion.parser import extract_text
from app.ingestion.chunker import chunk_text
from app.retrieval.retriever import retriever
from app.graph.entity_extractor import extract_entities
from app.graph.neo4j_store import save_graph

def ingest_document(pdf_path):

    text = extract_text(pdf_path)

    chunks = chunk_text(text)

    # Pinecone
    retriever.add_texts(chunks)

    # Neo4j
    for chunk in chunks:

        data = extract_entities(chunk)

        save_graph(data)


    return len(chunks)