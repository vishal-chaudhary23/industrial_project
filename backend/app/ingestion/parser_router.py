import os

from app.ingestion.pdf_parser import extract_pdf
from app.ingestion.ocr_parser import extract_image
from app.ingestion.excel_parser import extract_excel
from app.ingestion.email_parser import extract_email


def extract_document(file_path):

    extension = os.path.splitext(file_path)[1].lower()

    if extension == ".pdf":
        return extract_pdf(file_path)

    elif extension in [".png", ".jpg", ".jpeg"]:
        return extract_image(file_path)

    elif extension in [".xlsx", ".xls"]:
        return extract_excel(file_path)

    elif extension in [".msg", ".eml"]:
        return extract_email(file_path)

    else:
        raise ValueError(f"Unsupported file type: {extension}")