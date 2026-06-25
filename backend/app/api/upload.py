from fastapi import APIRouter, UploadFile, File, HTTPException
import os

from app.services.ingest_service import ingest_document

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg",
    ".xlsx",
    ".xls",
    ".eml",
    ".msg"
}


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {extension}"
        )

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as f:
        f.write(await file.read())

    chunks = ingest_document(file_path)

    result = ingest_document(file_path)

    return {
        "message": "Document ingested successfully",
        "filename": file.filename,
        "file_type": extension,
        **result
    }