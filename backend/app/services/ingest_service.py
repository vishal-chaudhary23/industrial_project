# from app.ingestion.parser import extract_text
from app.ingestion.parser_router import extract_document
from app.ingestion.chunker import chunk_text
from app.retrieval.retriever import retriever
from app.graph.entity_extractor import extract_entities
from app.graph.neo4j_store import save_graph
import os


def ingest_document(file_path):

    text, parser_used = extract_document(file_path)

    chunks = chunk_text(text)

    metadatas = []

    filename = os.path.basename(file_path)
    for _ in chunks:
        metadatas.append({
            "source": filename
        })

    # # Pinecone
    retriever.add_texts(
        texts=chunks,
        metadatas=metadatas
    )
    # retriever.add_texts(chunks)

    entity_count = 0
    relationship_count = 0

    # Neo4j
    for chunk in chunks:

        data = extract_entities(chunk)
    
        entity_count += len(data["entities"])

        relationship_count += len(data["relationships"])

        save_graph(data, filename)


    return {
        "parser": parser_used,
        "chunks": len(chunks),
        "entities": entity_count,
        "relationships": relationship_count
    }