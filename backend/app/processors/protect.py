import io
from pathlib import Path
from pypdf import PdfWriter, PdfReader


def protect_pdf(input_path: Path, password: str) -> bytes:
    reader = PdfReader(str(input_path))
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    writer.encrypt(password, algorithm="AES-256")
    buf = io.BytesIO()
    writer.write(buf)
    return buf.getvalue()
